var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { toCoord, toIndex } from './GameCoordCalculations';
import { EMPTY_FIELD, ROWS, COLUMNS } from './GameConstants';
import { advantageBoardLevel1, advantageBoardLevel2, advantageBoardLevel3, advantageBoardLevel4, advantageBoardLevel5 } from './GameAdvantageBoardMutations';
export var emptyBoardAsList = Array(ROWS * COLUMNS).fill(EMPTY_FIELD);
export var COLORS = [0, 1]; // 0 = red, 1 = orange
var PIECE_TYPES = [1, 2, 3];
var PIECES_BY_PIECE_TYPE = 3;
export function getStartingPieces() {
    var id = 0;
    var pieces = [];
    COLORS.forEach(function (color) {
        PIECE_TYPES.forEach(function (pieceType) {
            for (var i = 0; i < PIECES_BY_PIECE_TYPE; i++) {
                pieces.push({
                    id: id,
                    color: color,
                    pieceType: pieceType,
                });
                id += 1;
            }
        });
    });
    return pieces;
}
export function shufflePieces(pieces, ctx) {
    var _a;
    for (var i = pieces.length - 1; i > 0; i--) {
        var j = Math.floor(ctx.random.Number() * (i + 1));
        _a = [pieces[j], pieces[i]], pieces[i] = _a[0], pieces[j] = _a[1];
    }
    return pieces;
}
export function createStartingOrder(startingPieces, ctx) {
    // TODO generate 2 pieces arrays already...
    var startingOrder = [];
    var redPieces = [];
    var orangePieces = [];
    startingPieces.forEach(function (piece) {
        if (piece.color === 0) {
            redPieces.push(piece);
        }
        else {
            orangePieces.push(piece);
        }
    });
    [redPieces, orangePieces].forEach(function (pieces) { return shufflePieces(pieces, ctx); });
    for (var i = 0; i < startingPieces.length; i++) {
        if (i % 2 === 0) {
            startingOrder.push(redPieces[Math.floor(i / 2)]);
        }
        else {
            startingOrder.push(orangePieces[Math.floor(i / 2)]);
        }
    }
    return startingOrder;
}
// to go around the table from top left -> top right -> bottom right -> bottom left.
// 0,0 is bottom right
export function sortStartCoords(startCoords) {
    var topRow = [];
    var rightRow = [];
    var bottomRow = [];
    var leftRow = [];
    startCoords.forEach(function (coord) {
        if (coord.x === 0) {
            rightRow.push(coord);
        }
        else if (coord.y === ROWS - 1) {
            topRow.push(coord);
        }
        else if (coord.x === COLUMNS - 1) {
            leftRow.push(coord);
        }
        else if (coord.y === 0) {
            bottomRow.push(coord);
        }
    });
    var sortedCoords = topRow.reverse()
        .concat(rightRow.reverse())
        .concat(bottomRow)
        .concat(leftRow);
    return sortedCoords;
}
export function createAdvantageStartBoard(originalStartBoard, advantage, starterColor) {
    var board = __spreadArrays(originalStartBoard);
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
export function createBasicStartBoard(boardAsList, ctx) {
    var boardMatrix = Array(COLUMNS).fill(null).map(function () { return Array(ROWS).fill(null); });
    boardAsList.forEach(function (cell, index) {
        var coords = toCoord(index);
        boardMatrix[coords.x][coords.y] = cell;
    });
    var piecesInStartingOrder = createStartingOrder(getStartingPieces(), ctx);
    var startCoords = [];
    // get table edge coords
    for (var col = 0; col < COLUMNS; col++) {
        for (var row = 0; row < ROWS; row++) {
            if ((col === 0 || row === 0 || col === COLUMNS - 1 || row === ROWS - 1)
                && !(col === 0 && row === 0)
                && !(col === 0 && row === ROWS - 1)
                && !(col === COLUMNS - 1 && row === 0)
                && !(col === COLUMNS - 1 && row === ROWS - 1)) {
                startCoords.push({
                    x: col,
                    y: row,
                });
            }
        }
    }
    var sortedCoords = sortStartCoords(startCoords);
    sortedCoords.forEach(function (startingCoord, index) {
        boardMatrix[startingCoord.x][startingCoord.y] = piecesInStartingOrder[index];
    });
    var startingBoard = [];
    boardMatrix.forEach(function (col, colIndex) {
        col.forEach(function (rowCell, rowIndex) { return startingBoard[toIndex({ x: colIndex, y: rowIndex })] = rowCell; });
    });
    return startingBoard;
}
