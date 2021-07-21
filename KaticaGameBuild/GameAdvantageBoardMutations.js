var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { EMPTY_FIELD } from './GameConstants';
// TODO: use class to maintain state of playerPiecesBoard and to reduce code duplication...
export function advantageBoardLevel1(board, color) {
    var _a, _b, _c;
    var playerPiecesBoard = createPlayerPiecesBoard(board, color);
    var piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
    var piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
    var piece3Index = findIndexAndRemove(playerPiecesBoard, 3);
    _a = [board[piece1Index], board[27]], board[27] = _a[0], board[piece1Index] = _a[1];
    _b = [board[piece2Index], board[26]], board[26] = _b[0], board[piece2Index] = _b[1];
    _c = [board[piece3Index], board[21]], board[21] = _c[0], board[piece3Index] = _c[1];
    return board;
}
export function advantageBoardLevel2(board, color) {
    var _a, _b, _c;
    var playerPiecesBoard = createPlayerPiecesBoard(board, color);
    var piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
    var piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
    var piece3Index = findIndexAndRemove(playerPiecesBoard, 2);
    _a = [board[piece1Index], board[27]], board[27] = _a[0], board[piece1Index] = _a[1];
    _b = [board[piece2Index], board[26]], board[26] = _b[0], board[piece2Index] = _b[1];
    _c = [board[piece3Index], board[21]], board[21] = _c[0], board[piece3Index] = _c[1];
    return board;
}
export function advantageBoardLevel3(board, color) {
    var _a, _b, _c, _d;
    var playerPiecesBoard = createPlayerPiecesBoard(board, color);
    var piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
    var piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
    var piece3Index = findIndexAndRemove(playerPiecesBoard, 3);
    var piece4Index = findIndexAndRemove(playerPiecesBoard, 3);
    _a = [board[piece1Index], board[27]], board[27] = _a[0], board[piece1Index] = _a[1];
    _b = [board[piece2Index], board[26]], board[26] = _b[0], board[piece2Index] = _b[1];
    _c = [board[piece3Index], board[21]], board[21] = _c[0], board[piece3Index] = _c[1];
    _d = [board[piece4Index], board[20]], board[20] = _d[0], board[piece4Index] = _d[1];
    return board;
}
export function advantageBoardLevel4(board, color) {
    var _a, _b, _c, _d;
    var playerPiecesBoard = createPlayerPiecesBoard(board, color);
    var piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
    var piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
    var piece3Index = findIndexAndRemove(playerPiecesBoard, 2);
    var piece4Index = findIndexAndRemove(playerPiecesBoard, 3);
    _a = [board[piece1Index], board[27]], board[27] = _a[0], board[piece1Index] = _a[1];
    _b = [board[piece2Index], board[26]], board[26] = _b[0], board[piece2Index] = _b[1];
    _c = [board[piece3Index], board[21]], board[21] = _c[0], board[piece3Index] = _c[1];
    _d = [board[piece4Index], board[20]], board[20] = _d[0], board[piece4Index] = _d[1];
    return board;
}
export function advantageBoardLevel5(board, color) {
    var _a, _b, _c, _d, _e;
    var playerPiecesBoard = createPlayerPiecesBoard(board, color);
    var piece1Index = findIndexAndRemove(playerPiecesBoard, 1);
    var piece2Index = findIndexAndRemove(playerPiecesBoard, 2);
    var piece3Index = findIndexAndRemove(playerPiecesBoard, 2);
    var piece4Index = findIndexAndRemove(playerPiecesBoard, 3);
    var piece5Index = findIndexAndRemove(playerPiecesBoard, 3);
    _a = [board[piece1Index], board[27]], board[27] = _a[0], board[piece1Index] = _a[1];
    _b = [board[piece2Index], board[26]], board[26] = _b[0], board[piece2Index] = _b[1];
    _c = [board[piece3Index], board[21]], board[21] = _c[0], board[piece3Index] = _c[1];
    _d = [board[piece4Index], board[20]], board[20] = _d[0], board[piece4Index] = _d[1];
    _e = [board[piece5Index], board[15]], board[15] = _e[0], board[piece5Index] = _e[1];
    return board;
}
function createPlayerPiecesBoard(board, color) {
    var playerPieces = board
        .map(function (piece, index) {
        return {
            pieceIndex: index,
            piece: piece,
        };
    })
        .filter(function (playerPiece) { return playerPiece.piece.color === color; });
    playerPieces = shufflePlayerPiecesSeededRandom(playerPieces);
    return playerPieces;
}
function findIndexAndRemove(playerPiecesBoard, pieceType) {
    var index = playerPiecesBoard.findIndex(function (playerPiece) { return playerPiece.piece.pieceType === pieceType; });
    playerPiecesBoard[index] = __assign(__assign({}, playerPiecesBoard[index]), { piece: EMPTY_FIELD });
    return playerPiecesBoard[index].pieceIndex;
}
// to provide a repeatable random order for each match, so selected pieces will be the same.
function shufflePlayerPiecesSeededRandom(board) {
    var _a;
    var seed = board.findIndex(function (playerPiece) { return playerPiece.piece.pieceType === 3; });
    for (var i = board.length - 1; i > 0; i--) {
        var j = Math.floor(seededRandom(seed) * (i + 1));
        _a = [board[j], board[i]], board[i] = _a[0], board[j] = _a[1];
    }
    return board;
}
// based on
// https://softwareengineering.stackexchange.com/questions/260969/original-source-of-seed-9301-49297-233280-random-algorithm
function seededRandom(seed) {
    var max = 1;
    var min = 0;
    seed = seed * 9301 + 49297 % 233280;
    var rnd = seed / 233280.0;
    return min + rnd * (max - min);
}
