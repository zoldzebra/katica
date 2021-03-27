import * as React from 'react';
import * as R from 'ramda';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import { withTranslation, WithTranslation } from 'react-i18next';

import { IG, Piece, EMPTY_FIELD, toCoord, toIndex, getValidMoves } from './Game';
import { Token } from '@freeboardgame.org/boardgame.io/ui';
import { BoardProps } from "boardgame.io/react";
import {
  Checkerboard,
  IAlgebraicCoords,
  ICartesianCoords,
  IOnDragData,
  applyInvertion,
  algebraicToCartesian,
  IColorMap,
  cartesianToAlgebraic,
} from './CheckerboardCustom';
import { getObjectFromLocalStorage, mergeToObjectInLocalStorage, USER_MATCH_CREDENTIALS } from '../../utils/localStorageHelper';
import { StoredMatchCredentials } from '../../components/Lobby/MatchDetails';
import { AdvantageSelector } from './AdvantageSelector';
import { MatchTypeSelector } from './MatchTypeSelector';

export const STARTING_BOARDS = 'katicaStartingBoards';

interface StoredStartingBoards {
  [key: string]: Piece[];
}
interface IBoardProps extends BoardProps, WithTranslation {
  G: IG;
  ctx: any;
  moves: any;
  playerID: string | null;
  gameArgs?: any;
  step?: any;
}

interface IBoardState {
  selected: ICartesianCoords | null;
  validMovesHighlight: IColorMap;
  // originalStartingBoard: Piece[];
}

function roundCoords(coords: ICartesianCoords) {
  return { x: Math.round(coords.x), y: Math.round(coords.y) };
}

const isOnlineGame = true;

class KaticaBoard extends React.Component<IBoardProps, unknown> {
  state: IBoardState = {
    selected: null,
    validMovesHighlight: {},
  };

  componentDidMount = () => {
    const startingBoards = getObjectFromLocalStorage(STARTING_BOARDS) as StoredStartingBoards || undefined;
    if (!startingBoards || !startingBoards[this.props.matchID]) {
      mergeToObjectInLocalStorage(STARTING_BOARDS, {
        [this.props.matchID]: this.props.G.board
      });
    }
    this.syncStartingBoardsWithMatchCredentials();
  }

  getStartingBoardFromLocalStorage = () => {
    const startingBoards = getObjectFromLocalStorage(STARTING_BOARDS) as StoredStartingBoards || undefined;
    if (!startingBoards || !startingBoards[this.props.matchID]) {
      throw new Error('Starting board in localStorage not found!');
      return;
    }
    return startingBoards[this.props.matchID];
  }

  syncStartingBoardsWithMatchCredentials = () => {
    const matchCredentials = getObjectFromLocalStorage(USER_MATCH_CREDENTIALS) as StoredMatchCredentials || undefined;
    const startingBoards = getObjectFromLocalStorage(STARTING_BOARDS) as StoredStartingBoards || undefined;
    if (!matchCredentials || !startingBoards) {
      return
    }
    const userMatchIds = Object.keys(matchCredentials);
    const startingBoardMatchIds = Object.keys(startingBoards);
    const syncedStartingBoards: StoredStartingBoards = {};

    userMatchIds.forEach(matchId => {
      if (startingBoardMatchIds.includes(matchId)) {
        syncedStartingBoards[matchId] = startingBoards[matchId];
      }
    })
    localStorage.setItem(STARTING_BOARDS, JSON.stringify(syncedStartingBoards));
  }

  isInverted = true;

  shouldPlace = (coords: ICartesianCoords) => {
    return R.equals(this.props.G.board[toIndex(coords)], EMPTY_FIELD);
  }

  shouldDrag = (coords: ICartesianCoords) => {
    if (this.props.ctx.phase === 'Move' && !this.props.ctx.gameover) {
      const invertedCoords = applyInvertion(coords, this.isInverted);
      return this.props.G.board[toIndex(invertedCoords)].player === Number(this.props.ctx.currentPlayer);
    }
  };

  onClick = (coords: IAlgebraicCoords) => {
    if (this.props.ctx.phase === 'Place') {
      const position = algebraicToCartesian(coords.square);
      const boardIndex = toIndex(position);
      if (this.shouldPlace(position)) {
        this.props.moves.placePiece(boardIndex);
      }
    }
  }

  onDrag = (coords: IOnDragData) => {
    const x = coords.x;
    const y = coords.y;
    const originalX = coords.originalX;
    const originalY = coords.originalY;
    if (Math.sqrt((x - originalX) ** 2 + (y - originalY) ** 2) > 0.2) {
      this.setState({
        ...this.state,
        selected: applyInvertion({ x: originalX, y: originalY }, this.isInverted),
      });
    } else {
      this.setState({
        ...this.state,
        selected: null,
        validMovesHighlight: {},
      });
    }
  }

  onDrop = async (coords: ICartesianCoords) => {
    if (this.state.selected) {
      this.move(applyInvertion(roundCoords(coords), this.isInverted));
    }
  }

  move = async (coords: ICartesianCoords) => {
    if (this.state.selected === null || coords === null) {
      return;
    }

    await this.props.moves.movePiece(this.state.selected, coords);
    this.setState({
      ...this.state,
      selected: null,
      validMovesHighlight: {},
    });
  }

  getHighlightedSquares = () => {
    const { selected, validMovesHighlight } = this.state;
    const result = {} as IColorMap;

    if (selected !== null && !Object.keys(validMovesHighlight).length) {
      const { G, ctx } = this.props;
      const otherPlayer = ctx.currentPlayer === '0' ? 1 : 0;
      result[cartesianToAlgebraic(selected.x, selected.y, false)] = blue[200];
      const validMoves = getValidMoves(G, ctx, selected);
      validMoves && validMoves.forEach(field => {
        if (G.board[toIndex(field)].player === otherPlayer) {
          result[cartesianToAlgebraic(field.x, field.y, false)] = red[400];
        } else {
          result[cartesianToAlgebraic(field.x, field.y, false)] = blue[300];
        }
      });
      this.setState({
        validMovesHighlight: { ...result },
      })
    }
    return validMovesHighlight;
  }

  getStatus = () => {
    const { t } = this.props;
    const isPlayersTurn = isOnlineGame && this.props.ctx.currentPlayer === this.props.playerID;
    const isOpponentsTurn = isOnlineGame && this.props.ctx.currentPlayer !== this.props.playerID;

    if (isPlayersTurn) {
      return t('katicaBoard.yourTurn');
    }
    if (isOpponentsTurn) {
      return t('katicaBoard.waitingForOpponent');
    }
    return '';
  }

  getGameOver = () => {
    const { t } = this.props;
    const isPlayerWon = isOnlineGame
      && typeof this.props.ctx.gameover.winner !== 'undefined'
      && this.props.ctx.gameover.winner === this.props.playerID;
    const isOpponentWon = isOnlineGame
      && typeof this.props.ctx.gameover.winner !== 'undefined'
      && this.props.ctx.gameover.winner !== this.props.playerID;
    const isDraw = isOnlineGame
      && typeof this.props.ctx.gameover.winner === 'undefined'
      && this.props.ctx.gameover.draw;

    const gameOverText = t('katicaBoard.gameOver');
    let result = '';

    if (isPlayerWon) {
      result = t('katicaBoard.youWon');
    }
    if (isOpponentWon) {
      result = t('katicaBoard.youLost');
    }
    if (isDraw) {
      result = t('katicaBoard.draw');
    }
    return gameOverText.concat(result);
  }

  drawPiece = (piece: { data: Piece, index: number }) => {
    if (piece.data.pieceType === 1) {
      return (
        <g>
          <circle r="0.4" fill={piece.data.player === 0 ? red[900] : orange[500]} cx="0.5" cy="0.5" />
          <circle r="0.1" fill={grey[900]} cx="0.5" cy="0.5" />
        </g>
      )
    }
    if (piece.data.pieceType === 2) {
      return (
        <g>
          <circle r="0.4" fill={piece.data.player === 0 ? red[900] : orange[500]} cx="0.5" cy="0.5" />
          <circle r="0.1" fill={grey[900]} cx="0.35" cy="0.5" />
          <circle r="0.1" fill={grey[900]} cx="0.65" cy="0.5" />
        </g>
      )
    }
    if (piece.data.pieceType === 3) {
      return (
        <g>
          <circle r="0.4" fill={piece.data.player === 0 ? red[900] : orange[500]} cx="0.5" cy="0.5" />
          <circle r="0.1" fill={grey[900]} cx="0.35" cy="0.6" />
          <circle r="0.1" fill={grey[900]} cx="0.65" cy="0.6" />
          <circle r="0.1" fill={grey[900]} cx="0.5" cy="0.35" />
        </g>
      )
    }
  }

  getPieces = () => {
    return this.props.G.board
      .map((piece, index) => ({ data: piece, index }))
      .filter(piece => piece.data.id !== null)
      .map(piece => {
        const { x, y } = toCoord(piece.index);
        return (
          <Token
            x={x}
            y={y}
            draggable={true}
            shouldDrag={this.shouldDrag}
            onDrop={this.onDrop}
            onDrag={this.onDrag}
            animate={true}
            key={piece.data.id}
          >
            {this.drawPiece(piece)}
          </Token>
        );
      });
  }

  renderBoard = () => {
    return (
      <Checkerboard
        onClick={this.onClick}
        invert={true}
        highlightedSquares={this.getHighlightedSquares()}
        primaryColor={green[900]}
        secondaryColor={green[600]}
        style={{
          maxHeight: '70vh',
        }}
      >
        {this.getPieces()}
      </Checkerboard>
    )
  }

  renderStatus = (status: string) => {
    if (status === '') {
      return null;
    }
    return (
      <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '16px' }}>
        {status}
      </Typography>
    )
  }

  handleAgree = (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.moves.signAgreement();
  }

  setAdvantage = (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.moves.setAdvantage('a', this.getStartingBoardFromLocalStorage());
  }


  setAdvantage2 = (advantageLevel: string) => {
    this.props.moves.setAdvantage(advantageLevel, this.getStartingBoardFromLocalStorage());
  }

  setMatchType = (isAdvantageMatch: boolean) => {
    this.props.moves.setMatchType(isAdvantageMatch);
  }

  renderAgreement = (agreement: boolean) => {
    return (
      <>
        {agreement ? 'Lets go!' : 'Let me see...'}
      </>
    )
  }

  renderAdvantage = () => {
    // console.log('Board this.props', this.props);
    // console.log('Board this.state', this.state);

    if (!this.props.matchData) {
      console.log('BOARD: No matchdata found');
      return;
    }
    return (
      <div>
        <p>{this.props.matchData[0].name as string}: {this.renderAgreement(this.props.G.player0Agreed)}</p>
        <p>{this.props.matchData[1].name as string}: {this.renderAgreement(this.props.G.player1Agreed)}</p>
      </div>
    )
  }

  render() {
    if (this.props.ctx.phase === 'MatchType') {
      return (
        <div>
          {this.renderStatus(this.getStatus())}
          <MatchTypeSelector
            signAgreement={this.handleAgree}
            setMatchType={this.setMatchType}
            isAdvantageMatch={this.props.G.isAdvantageMatch}
          />
          {this.renderAdvantage()}
        </div>
      )
    }
    if (this.props.ctx.phase === 'Advantage') {
      return (
        <div>
          {this.renderStatus(this.getStatus())}
          {this.renderAdvantage()}
          <button onClick={this.setAdvantage}>Set advantage</button>
          <button onClick={this.handleAgree}>I agree</button>
          <AdvantageSelector
            setAdvantage={this.setAdvantage2}
          />
          {this.renderBoard()}
        </div>
      )
    }

    if (this.props.ctx.gameover) {
      return (
        <div>
          {this.renderStatus(this.getGameOver())}
          {this.renderBoard()}
        </div>
      );
    }
    return (
      <div>
        {this.renderStatus(this.getStatus())}
        {this.renderBoard()}
      </div>
    );
  }
}

export default withTranslation()(KaticaBoard);
