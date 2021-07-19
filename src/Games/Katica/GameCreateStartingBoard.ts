import { ICoord, toCoord, toIndex } from './GameCoordCalculations';
import { EMPTY_FIELD, ROWS, COLUMNS } from './GameConstants';
import {
  advantageBoardLevel1,
  advantageBoardLevel2,
  advantageBoardLevel3,
  advantageBoardLevel4,
  advantageBoardLevel5
} from './GameAdvantageBoardMutations';

export const emptyBoardAsList = Array(ROWS * COLUMNS).fill(EMPTY_FIELD);

export const COLORS = [0, 1];  // 0 = red, 1 = orange
const PIECE_TYPES = [1, 2, 3];
const PIECES_BY_PIECE_TYPE = 3;

export interface Piece {
  id: number | null,
  color: number | null,
  pieceType: number | null,
}

export function getStartingPieces(): Piece[] {
  let id = 0;
  const pieces: Piece[] = [];
  COLORS.forEach(color => {
    PIECE_TYPES.forEach(pieceType => {
      for (let i = 0; i < PIECES_BY_PIECE_TYPE; i++) {
        pieces.push({
          id,
          color,
          pieceType,
        });
        id += 1;
      }
    });
  });
  return pieces;
}

export function shufflePieces(pieces: Piece[], ctx: any): Piece[] {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(ctx.random.Number() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  return pieces;
}

export function createStartingOrder(startingPieces: Piece[], ctx: any): Piece[] {
  // TODO generate 2 pieces arrays already...
  const startingOrder: Piece[] = [];
  const redPieces: Piece[] = [];
  const orangePieces: Piece[] = [];
  startingPieces.forEach(piece => {
    if (piece.color === 0) {
      redPieces.push(piece);
    } else {
      orangePieces.push(piece);
    }
  });
  [redPieces, orangePieces].forEach(pieces => shufflePieces(pieces, ctx));
  for (let i = 0; i < startingPieces.length; i++) {
    if (i % 2 === 0) {
      startingOrder.push(redPieces[Math.floor(i / 2)]);
    } else {
      startingOrder.push(orangePieces[Math.floor(i / 2)]);
    }
  }
  return startingOrder;
}

// to go around the table from top left -> top right -> bottom right -> bottom left.
// 0,0 is bottom right
export function sortStartCoords(startCoords: ICoord[]): ICoord[] {
  const topRow: ICoord[] = [];
  const rightRow: ICoord[] = []
  const bottomRow: ICoord[] = [];
  const leftRow: ICoord[] = [];
  startCoords.forEach(coord => {
    if (coord.x === 0) {
      rightRow.push(coord);
    } else if (coord.y === ROWS - 1) {
      topRow.push(coord);
    } else if (coord.x === COLUMNS - 1) {
      leftRow.push(coord)
    } else if (coord.y === 0) {
      bottomRow.push(coord)
    }
  })
  const sortedCoords = topRow.reverse()
    .concat(rightRow.reverse())
    .concat(bottomRow)
    .concat(leftRow);
  return sortedCoords;
}

export function createAdvantageStartBoard(
  originalStartBoard: Piece[],
  advantage: number,
  starterColor: number,
): Piece[] {
  const board = [...originalStartBoard];

  switch (advantage) {
    case 0:
      return board;
    case 1:
      return advantageBoardLevel1(board, starterColor);
    case 2:
      return advantageBoardLevel2(board, starterColor);
    case 3:
      return advantageBoardLevel3(board, starterColor);
    case 4:
      return advantageBoardLevel4(board, starterColor);
    case 5:
      return advantageBoardLevel5(board, starterColor);
    default:
      return board;
  }
}

export function createBasicStartBoard(boardAsList: any[], ctx: any): Piece[] {
  const boardMatrix: Piece[][] = Array(COLUMNS).fill(null).map(() => Array(ROWS).fill(null));
  boardAsList.forEach((cell, index) => {
    const coords = toCoord(index);
    boardMatrix[coords.x][coords.y] = cell;
  });
  const piecesInStartingOrder = createStartingOrder(getStartingPieces(), ctx);
  const startCoords: ICoord[] = [];
  // get table edge coords
  for (let col = 0; col < COLUMNS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if ((col === 0 || row === 0 || col === COLUMNS - 1 || row === ROWS - 1)
        && !(col === 0 && row === 0)
        && !(col === 0 && row === ROWS - 1)
        && !(col === COLUMNS - 1 && row === 0)
        && !(col === COLUMNS - 1 && row === ROWS - 1)) {
        startCoords.push({
          x: col,
          y: row,
        })
      }
    }
  }
  const sortedCoords = sortStartCoords(startCoords);
  sortedCoords.forEach((startingCoord, index) => {
    boardMatrix[startingCoord.x][startingCoord.y] = piecesInStartingOrder[index];
  })

  const startingBoard: Piece[] = [];
  boardMatrix.forEach((col, colIndex) => {
    col.forEach((rowCell, rowIndex) => startingBoard[toIndex({ x: colIndex, y: rowIndex })] = rowCell);
  })
  return startingBoard;
}