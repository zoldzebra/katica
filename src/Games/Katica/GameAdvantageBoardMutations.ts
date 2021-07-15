import { Piece } from './GameCreateStartingBoard';
import { EMPTY_FIELD } from './GameConstants';


// use class?
export function advantageBoardLevel1(board: Piece[], color: number): Piece[] {
  const playerPiecesBoard = createPlayerPiecesBoard(board, color);

  const piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
  const piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
  const piece3Index = findIndexAndRemove(playerPiecesBoard, 3);

  [board[27], board[piece1Index]] = [board[piece1Index], board[27]];
  [board[26], board[piece2Index]] = [board[piece2Index], board[26]];
  [board[21], board[piece3Index]] = [board[piece3Index], board[21]];

  return board;
}

export function advantageBoardLevel2(board: Piece[], color: number): Piece[] {
  const playerPiecesBoard = createPlayerPiecesBoard(board, color);

  const piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
  const piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
  const piece3Index = findIndexAndRemove(playerPiecesBoard, 2);

  [board[27], board[piece1Index]] = [board[piece1Index], board[27]];
  [board[26], board[piece2Index]] = [board[piece2Index], board[26]];
  [board[21], board[piece3Index]] = [board[piece3Index], board[21]];

  return board;
}

export function advantageBoardLevel3(board: Piece[], color: number): Piece[] {
  const playerPiecesBoard = createPlayerPiecesBoard(board, color);

  const piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
  const piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
  const piece3Index = findIndexAndRemove(playerPiecesBoard, 3);

  const piece4Index = findIndexAndRemove(playerPiecesBoard, 3);

  [board[27], board[piece1Index]] = [board[piece1Index], board[27]];
  [board[26], board[piece2Index]] = [board[piece2Index], board[26]];
  [board[21], board[piece3Index]] = [board[piece3Index], board[21]];

  [board[20], board[piece4Index]] = [board[piece4Index], board[20]];

  return board;
}

export function advantageBoardLevel4(board: Piece[], color: number): Piece[] {
  const playerPiecesBoard = createPlayerPiecesBoard(board, color);

  const piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
  const piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
  const piece3Index = findIndexAndRemove(playerPiecesBoard, 2);

  const piece4Index = findIndexAndRemove(playerPiecesBoard, 3);

  [board[27], board[piece1Index]] = [board[piece1Index], board[27]];
  [board[26], board[piece2Index]] = [board[piece2Index], board[26]];
  [board[21], board[piece3Index]] = [board[piece3Index], board[21]];

  [board[20], board[piece4Index]] = [board[piece4Index], board[20]];

  return board;
}

export function advantageBoardLevel5(board: Piece[], color: number): Piece[] {
  const playerPiecesBoard = createPlayerPiecesBoard(board, color);

  const piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
  const piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
  const piece3Index = findIndexAndRemove(playerPiecesBoard, 2);
  const piece4Index = findIndexAndRemove(playerPiecesBoard, 3);

  const piece5Index = findIndexAndRemove(playerPiecesBoard, 3);

  [board[27], board[piece1Index]] = [board[piece1Index], board[27]];
  [board[26], board[piece2Index]] = [board[piece2Index], board[26]];
  [board[21], board[piece3Index]] = [board[piece3Index], board[21]];
  [board[20], board[piece4Index]] = [board[piece4Index], board[20]];

  [board[15], board[piece5Index]] = [board[piece5Index], board[15]];

  return board;
}

function createPlayerPiecesBoard(board: Piece[], color: number): Piece[] {
  const playerPieces = board.map(piece => {
    if (piece.color === color) {
      return piece;
    }
    return EMPTY_FIELD;
  })

  return playerPieces;
}

function findIndexAndRemove(playerPiecesBoard: Piece[], pieceType: number): number {
  const index = playerPiecesBoard.findIndex(piece => {
    if (piece) {
      return piece.pieceType === pieceType;
    }
  });

  playerPiecesBoard[index] = EMPTY_FIELD;

  return index;
}