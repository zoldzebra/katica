import { Piece } from './GameCreateStartingBoard';
import { EMPTY_FIELD } from './GameConstants';


interface PlayerPieces {
  pieceIndex: number,
  piece: Piece,
}

// TODO: use class to maintain state of playerPiecesBoard and to reduce code duplication...
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

function createPlayerPiecesBoard(board: Piece[], color: number): PlayerPieces[] {
  let playerPieces = board
    .map((piece, index) => {
      return {
        pieceIndex: index,
        piece: piece,
      }
    })
    .filter(playerPiece => playerPiece.piece.color === color);

  playerPieces = shufflePlayerPiecesSeededRandom(playerPieces);

  return playerPieces;
}

function findIndexAndRemove(playerPiecesBoard: PlayerPieces[], pieceType: number): number {
  const index = playerPiecesBoard.findIndex(playerPiece => playerPiece.piece.pieceType === pieceType);

  playerPiecesBoard[index] = {
    ...playerPiecesBoard[index],
    piece: EMPTY_FIELD
  };

  return playerPiecesBoard[index].pieceIndex;
}

function shufflePlayerPiecesSeededRandom(board: PlayerPieces[]): PlayerPieces[] {
  const seed = board.findIndex(playerPiece => playerPiece.piece.pieceType === 3);
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed) * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }

  return board;
}

// based on
// https://softwareengineering.stackexchange.com/questions/260969/original-source-of-seed-9301-49297-233280-random-algorithm
function seededRandom(seed: number): number {
  const max = 1;
  const min = 0;

  seed = seed * 9301 + 49297 % 233280;
  const rnd = seed / 233280.0;

  return min + rnd * (max - min);
}
