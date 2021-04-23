import { ROWS, COLUMNS } from './GameConstants';
import { toCoord } from './GameCoordCalculations';
import { IG } from './Game';

interface Result {
  winner?: string;
  draw?: boolean;
}

function findGroup(boardMatrix: (number | null)[][], col: number, row: number, player: number): number {
  if (boardMatrix[col][row] !== player) {
    return 0;
  }
  boardMatrix[col][row] = null;
  let size = 1;
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  directions.forEach(dir => {
    if (col + dir[0] < boardMatrix.length
      && col + dir[0] >= 0
      && row + dir[1] < boardMatrix[0].length
      && row + dir[1] >= 0) {
      size += findGroup(boardMatrix, col + dir[0], row + dir[1], player);
    }
  });
  return size;
}

export function getMatchResult(G: IG): Result | null {
  const boardMatrix: (number | null)[][] = Array(COLUMNS).fill(null).map(() => Array(ROWS).fill(null));
  G.board.forEach((cell, index) => {
    const coords = toCoord(index);
    boardMatrix[coords.x][coords.y] = cell.player;
  });
  const players = [0, 1];
  const player0Groups = [];
  const player1Groups = [];
  let size = 0;

  for (let col = 0; col < COLUMNS; col++) {
    for (let row = 0; row < ROWS; row++) {
      players.forEach(player => {
        if (boardMatrix[col][row] === player) {
          size = findGroup(boardMatrix, col, row, player);
          if (size > 0) {
            player === 0
              ? player0Groups.push(size)
              : player1Groups.push(size)
          }
        }
      })
    }
  }
  // TODO refactor this part, its ugly
  if (player0Groups.length === 1 || player1Groups.length === 1) {
    if (player0Groups.length === 1 && player1Groups.length !== 1) {
      return {
        winner: '0'
      };
    } else if (player1Groups.length === 1 && player0Groups.length !== 1) {
      return {
        winner: '1'
      };
    } else if (player1Groups.length === 1 && player0Groups.length === 1) {
      return {
        draw: true
      };
    }
  }
  return null;
}