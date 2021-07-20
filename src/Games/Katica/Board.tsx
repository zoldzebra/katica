import * as React from 'react';
import * as R from 'ramda';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Token } from '@freeboardgame.org/boardgame.io/ui';
import { BoardProps } from "boardgame.io/react";

import { IG } from './Game';
import { Piece } from './GameCreateStartingBoard';
import { toCoord, toIndex } from './GameCoordCalculations';
import { getValidMoves, getActualPlayerColors } from './GamePieceMoves';
import { EMPTY_FIELD } from './GameConstants';
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
import { ColorSelector } from './ColorSelector';
import { MatchStarterSelector } from './MatchStarterSelector';
import { MatchTypeSelector } from './MatchTypeSelector';
import { MatchSetupWrapper } from './MatchSetupWrapper';
import { MatchDisplayWrapper } from './MatchDisplayWrapper';


export const STARTING_BOARDS = 'katicaStartingBoards';

type Color = typeof Color[keyof typeof Color]
export const Color = {
  red: red[900],
  orange: orange[500],
  grey: grey[900],
} as const;

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
      return this.props.G.board[toIndex(invertedCoords)].color ===
        getActualPlayerColors(this.props.G.isPlayer0Red, Number(this.props.ctx.currentPlayer)).actualPlayer;
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
      const otherPlayerColor = getActualPlayerColors(G.isPlayer0Red, Number(ctx.currentPlayer)).otherPlayer;
      result[cartesianToAlgebraic(selected.x, selected.y, false)] = blue[200];
      const validMoves = getValidMoves(G, ctx, selected);
      validMoves && validMoves.forEach(field => {
        if (G.board[toIndex(field)].color === otherPlayerColor) {
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

    if (this.props.ctx.gameover) {
      return this.getGameOver();
    }

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
          <circle r="0.4" fill={piece.data.color === 0 ? Color.red : Color.orange} cx="0.5" cy="0.5" />
          <circle r="0.1" fill={Color.grey} cx="0.5" cy="0.5" />
        </g>
      )
    }
    if (piece.data.pieceType === 2) {
      return (
        <g>
          <circle r="0.4" fill={piece.data.color === 0 ? Color.red : Color.orange} cx="0.5" cy="0.5" />
          <circle r="0.1" fill={Color.grey} cx="0.35" cy="0.5" />
          <circle r="0.1" fill={Color.grey} cx="0.65" cy="0.5" />
        </g>
      )
    }
    if (piece.data.pieceType === 3) {
      return (
        <g>
          <circle r="0.4" fill={piece.data.color === 0 ? Color.red : Color.orange} cx="0.5" cy="0.5" />
          <circle r="0.1" fill={Color.grey} cx="0.35" cy="0.6" />
          <circle r="0.1" fill={Color.grey} cx="0.65" cy="0.6" />
          <circle r="0.1" fill={Color.grey} cx="0.5" cy="0.35" />
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

  handleAgree = (eventIgnored: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.props.moves.signAgreement();
  }

  setAdvantage = (advantage: number) => {
    this.props.moves.setAdvantage(advantage, this.getStartingBoardFromLocalStorage());
  }

  setMatchType = (isAdvantageMatch: boolean) => {
    this.props.moves.setMatchType(isAdvantageMatch);
  }

  switchPlayerColors = () => {
    this.props.moves.switchPlayerColors();
  }

  setMatchStarter = (matchStarter: string) => {
    this.props.moves.setMatchStarter(matchStarter);
  }

  getPlayerNames = () => {
    let rawNames: string[] = [];
    if (!this.props.matchData
      || !this.props.matchData[0].name
      || !this.props.matchData[1].name
      || !this.props.playerID) {
      rawNames = ['Player0', 'Player1'];
    }
    if (this.props?.matchData) {
      rawNames = [this.props.matchData[0].name as string, this.props.matchData[1].name as string];
      rawNames[Number(this.props.playerID)] = `${rawNames[Number(this.props.playerID)]} (You)`;
    }
    return rawNames;
  }

  getMatchSetupPhase = () => {
    switch (this.props.ctx.phase) {
      case 'MatchType': return (
        <MatchTypeSelector
          setMatchType={this.setMatchType}
          isAdvantageMatch={this.props.G.isAdvantageMatch}
        />
      );
      case 'ChooseColor': return (
        <ColorSelector
          switchPlayerColors={this.switchPlayerColors}
          isPlayer0Red={this.props.G.isPlayer0Red}
          playerNames={this.playerNames}
        />
      );
      case 'MatchStarter': return (
        <MatchStarterSelector
          setMatchStarter={this.setMatchStarter}
          matchStarter={this.props.G.matchStarter}
          playerNames={this.playerNames}
        />
      );
      case 'SetAdvantage': return (
        <AdvantageSelector
          setAdvantage={this.setAdvantage}
          advantage={this.props.G.advantage}
        />
      );
      default: return undefined;
    }
  }

  matchSetup = () => {
    return (
      <MatchSetupWrapper
        signAgreement={this.handleAgree}
      >
        {this.getMatchSetupPhase()}
      </MatchSetupWrapper>
    )
  }

  playerNames = this.getPlayerNames();
  playerAgreement = [this.props.G.player0Agreed, this.props.G.player1Agreed];

  render() {
    return (
      <MatchDisplayWrapper
        status={this.getStatus()}
        matchSetup={this.matchSetup()}
        board={this.renderBoard()}>
      </MatchDisplayWrapper>
    )
  }
}

export default withTranslation()(KaticaBoard);
