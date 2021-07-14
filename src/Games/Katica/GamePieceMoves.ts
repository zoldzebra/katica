import { INVALID_MOVE } from 'boardgame.io/core';
import * as R from 'ramda';

import { IG } from './Game';
import { ICoord, toIndex, areCoordsEqual } from './GameCoordCalculations';
import { ALL_MOVES, EMPTY_FIELD } from './GameConstants';

interface PlayerColors {
  actualPlayer: number,
  otherPlayer: number,
}

export function getValidMoves(G: IG, ctx: any, moveFrom: ICoord): ICoord[] | null {
  const board = [...G.board];
  const actualPieceType = board[toIndex(moveFrom)].pieceType;
  if (!actualPieceType) {
    return null;
  }
  const moveSet = actualPieceType - 1;
  if (moveSet < 0) {
    return null;
  }

  const playerColors = getActualPlayerColors(G.isPlayer0Red, Number(ctx.currentPlayer));

  const possibleMoves = ALL_MOVES[moveSet]
    .map(move => {
      const newX = moveFrom.x + move.x;
      const newY = moveFrom.y + move.y;
      return {
        x: newX,
        y: newY,
      }
    })
    // TODO: use constants here
    .filter(coords => (coords.x <= 5 && coords.x >= 0) && (coords.y <= 6 && coords.y >= 0))
    .filter(coords => board[toIndex(coords)].color !== playerColors.actualPlayer);

  const opponentFields = possibleMoves.filter(coords => board[toIndex(coords)].color === playerColors.otherPlayer);
  // dont jump over opponent + cant move over (knock out) too close opp
  let validMoves: ICoord[] = [];
  if (opponentFields) {
    const vectorsToOpponents = opponentFields.map(opponent => {
      return {
        x: opponent.x - moveFrom.x,
        y: opponent.y - moveFrom.y,
        distance: Math.max(Math.abs(opponent.x - moveFrom.x), Math.abs(opponent.y - moveFrom.y)),
      };
    });
    validMoves = possibleMoves
      .filter(coords => {
        const vectorToMove = {
          x: coords.x - moveFrom.x,
          y: coords.y - moveFrom.y
        };
        const standsInTheWayOrTooClose = vectorsToOpponents.some(vectorToOpp => {
          // vertically
          if (vectorToOpp.y === 0
            && vectorToMove.y === 0
            && vectorToOpp.x !== vectorToMove.x
            && Math.sign(vectorToOpp.x) === Math.sign(vectorToMove.x)
            && Math.abs(vectorToMove.x) > Math.abs(vectorToOpp.x)) {
            return true;
          }
          // horizontally
          if (vectorToOpp.x === 0
            && vectorToMove.x === 0
            && vectorToOpp.y !== vectorToMove.y
            && Math.sign(vectorToOpp.y) === Math.sign(vectorToMove.y)
            && Math.abs(vectorToMove.y) > Math.abs(vectorToOpp.y)) {
            return true;
          }
          // diagonally
          if (Math.abs(vectorToOpp.x) === Math.abs(vectorToOpp.y)
            && Math.abs(vectorToMove.x) === Math.abs(vectorToMove.y)
            && Math.sign(vectorToOpp.x) === Math.sign(vectorToMove.x)
            && Math.sign(vectorToOpp.y) === Math.sign(vectorToMove.y)
            && Math.abs(vectorToMove.x) > Math.abs(vectorToOpp.x)
            && Math.abs(vectorToMove.y) > Math.abs(vectorToOpp.y)) {
            return true;
          }
          // opponent too close
          if (areCoordsEqual(vectorToOpp, vectorToMove)
            && vectorToOpp.distance < actualPieceType) {
            return true;
          }
          return false;
        });
        if (!standsInTheWayOrTooClose) {
          return coords;
        }
      });
  } else {
    validMoves = [...possibleMoves];
  }
  return validMoves;
}

export function movePiece(G: IG, ctx: any, moveFrom: ICoord, moveTo: ICoord): IG | string {
  const validMoves = getValidMoves(G, ctx, moveFrom);
  if (!validMoves) {
    return INVALID_MOVE;
  }
  const board = [...G.board];

  if (!validMoves.find(dir => R.equals(dir, moveTo))) {
    return INVALID_MOVE;
  } else {
    board[toIndex(moveTo)] = board[toIndex(moveFrom)];
    board[toIndex(moveFrom)] = EMPTY_FIELD;
    const newG = {
      ...G,
      board,
    }
    return { ...newG };
  }
}

export const getActualPlayerColors = (isPlayer0Red: boolean, currentPlayer: number): PlayerColors => {
  if (isPlayer0Red && currentPlayer === 0
    || !isPlayer0Red && currentPlayer === 1) {
    return {
      actualPlayer: 0,
      otherPlayer: 1,
    };
  }
  return {
    actualPlayer: 1,
    otherPlayer: 0,
  };
}
