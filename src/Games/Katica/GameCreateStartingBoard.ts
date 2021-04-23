import { ICoord, toCoord, toIndex } from './GameCoordCalculations';
import { EMPTY_FIELD, ROWS, COLUMNS } from './GameConstants';

export const initialBoardAsList = Array(ROWS * COLUMNS).fill(EMPTY_FIELD);

export interface Piece {
  id: number | null,
  player: number | null,
  pieceType: number | null,
}

export function getStartingPieces(): Piece[] {
  const players = [0, 1];
  const pieceTypes = [1, 2, 3];
  const piecesPerPieceType = 3;
  let id = 0;
  const pieces: Piece[] = [];
  players.forEach(player => {
    pieceTypes.forEach(pieceType => {
      for (let i = 0; i < piecesPerPieceType; i++) {
        pieces.push({
          id,
          player,
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
  const player0Pieces: Piece[] = [];
  const player1Pieces: Piece[] = [];
  startingPieces.forEach(piece => {
    if (piece.player === 0) {
      player0Pieces.push(piece);
    } else {
      player1Pieces.push(piece);
    }
  });
  [player0Pieces, player1Pieces].forEach(pieces => shufflePieces(pieces, ctx));
  for (let i = 0; i < startingPieces.length; i++) {
    if (i % 2 === 0) {
      startingOrder.push(player0Pieces[Math.floor(i / 2)]);
    } else {
      startingOrder.push(player1Pieces[Math.floor(i / 2)]);
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

export function createDummyAlternateStartBoard(originalStartBoard: Piece[]): Piece[] {
  const alternateStartBoard = [...originalStartBoard];
  alternateStartBoard[1] = EMPTY_FIELD;
  alternateStartBoard[2] = EMPTY_FIELD;
  alternateStartBoard[3] = EMPTY_FIELD;
  alternateStartBoard[4] = EMPTY_FIELD;
  alternateStartBoard[5] = EMPTY_FIELD;
  alternateStartBoard[6] = EMPTY_FIELD;
  alternateStartBoard[7] = EMPTY_FIELD;


  alternateStartBoard[38] = EMPTY_FIELD;
  alternateStartBoard[37] = EMPTY_FIELD;
  alternateStartBoard[36] = EMPTY_FIELD;
  alternateStartBoard[35] = EMPTY_FIELD;

  return alternateStartBoard;
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