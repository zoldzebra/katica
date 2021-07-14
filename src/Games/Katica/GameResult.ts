import { ROWS, COLUMNS } from './GameConstants';
import { toCoord } from './GameCoordCalculations';
import { IG } from './Game';
import { getActualPlayerColors } from './GamePieceMoves';

interface Result {
  winner?: string;
  draw?: boolean;
}

function findGroup(boardColorMatrix: (number | null)[][], col: number, row: number, playerColor: number): number {
  if (boardColorMatrix[col][row] !== playerColor) {
    return 0;
  }
  boardColorMatrix[col][row] = null;
  let size = 1;
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  directions.forEach(dir => {
    if (col + dir[0] < boardColorMatrix.length
      && col + dir[0] >= 0
      && row + dir[1] < boardColorMatrix[0].length
      && row + dir[1] >= 0) {
      size += findGroup(boardColorMatrix, col + dir[0], row + dir[1], playerColor);
    }
  });
  return size;
}

export function getMatchResult(G: IG): Result | null {
  const boardColorMatrix: (number | null)[][] = Array(COLUMNS).fill(null).map(() => Array(ROWS).fill(null));
  G.board.forEach((cell, index) => {
    const coords = toCoord(index);
    boardColorMatrix[coords.x][coords.y] = cell.color;
  });
  const players = [0, 1];
  const playerColors = getPlayerColorsOrdered(G.isPlayer0Red);
  const playerGroups = [0, 0];
  let size = 0;

  for (let col = 0; col < COLUMNS; col++) {
    for (let row = 0; row < ROWS; row++) {
      for (let player = 0; player < players.length; player++) {
        const playerColor = playerColors[player];
        if (boardColorMatrix[col][row] === playerColor) {
          size = findGroup(boardColorMatrix, col, row, playerColor);
          if (size > 0) {
            playerGroups[player]++;
          }
        }
      }
    }
  }

  return createMatchResult(playerGroups);
}

function createMatchResult(playerGroups: number[]): Result | null {
  const winnerIndex = playerGroups.findIndex(group => group === 1);

  if (winnerIndex === -1) {
    return null;
  }
  if (playerGroups.every(group => group === 1)) {
    return {
      draw: true
    };
  }
  return {
    winner: winnerIndex.toString()
  }
}

function getPlayerColorsOrdered(isPlayer0Red: boolean): number[] {
  const playerColors = getActualPlayerColors(isPlayer0Red, 0);
  const player0Color = playerColors.actualPlayer;
  const player1Color = playerColors.otherPlayer;
  return [player0Color, player1Color];
}
