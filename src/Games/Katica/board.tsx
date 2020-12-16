import * as React from 'react';
import * as R from 'ramda';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';

// import { IGameArgs } from 'components/App/Game/GameBoardWrapper';
// import { GameLayout } from 'components/App/Game/GameLayout';
// import { isOnlineGame, isAIGame } from '../common/gameMode';
import { IG, Piece, EMPTY_FIELD, toCoord, toIndex, getValidMoves } from './game';
import { Token } from '@freeboardgame.org/boardgame.io/ui';
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

interface IBoardProps {
  G: IG;
  ctx: any;
  moves: any;
  playerID: string;
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
const isAIGame = false;

export class Board extends React.Component<IBoardProps, unknown> {
  state: IBoardState = {
    selected: null,
    validMovesHighlight: {},
  };

  isInverted() {
    // return isOnlineGame(this.props.gameArgs) && this.props.playerID === '1';
    return true;
  }

  shouldPlace = (coords: ICartesianCoords) => {
    return R.equals(this.props.G.board[toIndex(coords)], EMPTY_FIELD);
  }

  _shouldDrag = (coords: ICartesianCoords) => {
    if (this.props.ctx.phase === 'Move' && !this.props.ctx.gameover) {
      const invertedCoords = applyInvertion(coords, this.isInverted());
      return this.props.G.board[toIndex(invertedCoords)].player === Number(this.props.ctx.currentPlayer);
    }
  };

  _onClick = (coords: IAlgebraicCoords) => {
    if (this.props.ctx.phase === 'Place') {
      const position = algebraicToCartesian(coords.square);
      const boardIndex = toIndex(position);
      if (this.shouldPlace(position)) {
        this.props.moves.placePiece(boardIndex);
      }
    }
  };

  _onDrag = (coords: IOnDragData) => {
    const x = coords.x;
    const y = coords.y;
    const originalX = coords.originalX;
    const originalY = coords.originalY;
    if (Math.sqrt((x - originalX) ** 2 + (y - originalY) ** 2) > 0.2) {
      this.setState({
        ...this.state,
        selected: applyInvertion({ x: originalX, y: originalY }, this.isInverted()),
      });
    } else {
      this.setState({
        ...this.state,
        selected: null,
        validMovesHighlight: {},
      });
    }
  };

  _onDrop = async (coords: ICartesianCoords) => {
    if (this.state.selected) {
      this._move(applyInvertion(roundCoords(coords), this.isInverted()));
    }
  };

  _move = async (coords: ICartesianCoords) => {
    if (this.state.selected === null || coords === null) {
      return;
    }

    await this.props.moves.movePiece(this.state.selected, coords);
    this.setState({
      ...this.state,
      selected: null,
      validMovesHighlight: {},
    });
    // if (isAIGame(this.props.gameArgs) && this.props.ctx.currentPlayer === '1') {
    //   this.stepAI();
    // }
  };

  _getHighlightedSquares() {
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

  _getStatus() {
    if (isOnlineGame) {
      if (this.props.ctx.currentPlayer === this.props.playerID) {
        return 'YOUR TURN';
      } else {
        return 'Waiting for opponent...';
      }
    } else {
      // Local or AI game
      switch (this.props.ctx.currentPlayer) {
        case '0':
          return "Red's turn";
        case '1':
          return "Orange's turn";
      }
    }
  }

  _getGameOver() {

    if (isOnlineGame) {
      // Online game
      if (this.props.ctx.gameover.winner !== undefined) {
        if (this.props.ctx.gameover.winner === this.props.playerID) {
          return 'you won';
        } else {
          return 'you lost';
        }
      } else {
        return 'draw';
      }
    } else if (isAIGame) {
      switch (this.props.ctx.gameover.winner) {
        case '0':
          return 'you won';
        case '1':
          return 'you lost';
        case undefined:
          return 'draw';
      }
    } else {
      // Local game
      switch (this.props.ctx.gameover.winner) {
        case '0':
          return 'red won';
        case '1':
          return 'orange won';
        case undefined:
          return 'draw';
      }
    }
  }

  render() {
    if (this.props.ctx.gameover) {
      return (
        <Typography>
          GAME OVER
        </Typography>
      );
    }
    return this._getBoard();
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
            shouldDrag={this._shouldDrag}
            onDrop={this._onDrop}
            onDrag={this._onDrag}
            animate={true}
            key={piece.data.id}
          >
            {this.drawPiece(piece)}
          </Token>
        );
      });
  };

  _getBoard() {
    return (
      <div>
        <Typography variant="h5" style={{ textAlign: 'center', color: 'white', marginBottom: '16px' }}>
          {this._getStatus()}
        </Typography>
        <Checkerboard
          onClick={this._onClick}
          invert={true}
          highlightedSquares={this._getHighlightedSquares()}
          primaryColor={green[900]}
          secondaryColor={green[600]}
        >
          {this.getPieces()}
        </Checkerboard>
      </div>
    );
  }

  _getGameOverBoard() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Checkerboard
          onClick={this._onClick}
          invert={true}
          highlightedSquares={this._getHighlightedSquares()}
          primaryColor={green[900]}
          secondaryColor={green[600]}
        >
          {this.getPieces()}
        </Checkerboard>
      </div>
    );
  }
}

export default Board;
