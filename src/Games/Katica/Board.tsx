import * as React from 'react';
import * as R from 'ramda';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';

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

interface IBoardProps extends BoardProps {
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

export class KaticaBoard extends React.Component<IBoardProps, unknown> {
  state: IBoardState = {
    selected: null,
    validMovesHighlight: {},
  };

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
    const isPlayersTurn = isOnlineGame && this.props.ctx.currentPlayer === this.props.playerID;
    const isOpponentsTurn = isOnlineGame && this.props.ctx.currentPlayer !== this.props.playerID;

    let status = '';

    if (isPlayersTurn) {
      status = 'Your turn';
    }
    if (isOpponentsTurn) {
      status = 'Waiting for opponent';
    }
    return status;
  }

  getGameOver = () => {
    const isPlayerWon = isOnlineGame
      && typeof this.props.ctx.gameover.winner !== 'undefined'
      && this.props.ctx.gameover.winner === this.props.playerID;
    const isOpponentWon = isOnlineGame
      && typeof this.props.ctx.gameover.winner !== 'undefined'
      && this.props.ctx.gameover.winner !== this.props.playerID;
    const isDraw = isOnlineGame
      && typeof this.props.ctx.gameover.winner === 'undefined'
      && this.props.ctx.gameover.draw;

    const gameOverText = 'Game over: ';
    let result = '';

    if (isPlayerWon) {
      result = 'You won';
    }
    if (isOpponentWon) {
      result = 'You lost';
    }
    if (isDraw) {
      result = 'Draw';
    }
    return gameOverText.concat(result);
  }

  render() {
    if (this.props.ctx.gameover) {
      return this.getGameOverBoard();
    }
    return this.getActiveBoard();
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

  getActiveBoard = () => {
    return (
      <div>
        {this.renderStatus(this.getStatus())}
        {this.renderBoard()}
      </div>
    );
  }

  getGameOverBoard = () => {
    return (
      <div>
        {this.renderStatus(this.getGameOver())}
        {this.renderBoard()}
      </div>
    );
  }
}

export default KaticaBoard;
