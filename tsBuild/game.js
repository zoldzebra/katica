/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// import { Game, INVALID_MOVE } from '@freeboardgame.org/boardgame.io/core';
import { INVALID_MOVE } from 'boardgame.io/core';
import * as R from 'ramda';
export var Phase;
(function (Phase) {
    Phase["Place"] = "Place";
    Phase["Move"] = "Move";
})(Phase || (Phase = {}));
export var EMPTY_FIELD = {
    id: null,
    player: null,
    pieceType: null,
};
var ALL_MOVES = [
    [
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: -1, y: 1 },
    ],
    [
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: -1, y: 1 },
        { x: 2, y: 0 },
        { x: 2, y: -2 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
        { x: 0, y: -2 },
        { x: -2, y: 0 },
        { x: -2, y: -2 },
        { x: -2, y: 2 },
    ],
    [
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: -1, y: 1 },
        { x: 2, y: 0 },
        { x: 2, y: -2 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
        { x: 0, y: -2 },
        { x: -2, y: 0 },
        { x: -2, y: -2 },
        { x: -2, y: 2 },
        { x: 3, y: 0 },
        { x: 3, y: -3 },
        { x: 3, y: 3 },
        { x: 0, y: 3 },
        { x: 0, y: -3 },
        { x: -3, y: 0 },
        { x: -3, y: -3 },
        { x: -3, y: 3 },
    ],
];
var ROWS = 7;
var COLUMNS = 6;
var initialBoard = Array(ROWS * COLUMNS).fill(EMPTY_FIELD);
function getStartingPieces() {
    var players = [0, 1];
    var pieceTypes = [1, 2, 3];
    var piecesPerPieceType = 3;
    var id = 0;
    var pieces = [];
    players.forEach(function (player) {
        pieceTypes.forEach(function (pieceType) {
            for (var i = 0; i < piecesPerPieceType; i++) {
                pieces.push({
                    id: id,
                    player: player,
                    pieceType: pieceType,
                });
                id += 1;
            }
        });
    });
    return pieces;
}
function shuffleArray(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
function createStartingOrder(startingPieces) {
    // TODO generate 2 pieces arrays already...
    var startingOrder = [];
    var player0Pieces = [];
    var player1Pieces = [];
    startingPieces.forEach(function (piece) {
        if (piece.player === 0) {
            player0Pieces.push(piece);
        }
        else {
            player1Pieces.push(piece);
        }
    });
    [player0Pieces, player1Pieces].forEach(function (pieces) { return shuffleArray(pieces); });
    for (var i = 0; i < startingPieces.length; i++) {
        if (i % 2 === 0) {
            startingOrder.push(player0Pieces[Math.floor(i / 2)]);
        }
        else {
            startingOrder.push(player1Pieces[Math.floor(i / 2)]);
        }
    }
    return startingOrder;
}
// to go around the table from top left -> top right -> bottom right -> bottom left.
// 0,0 is bottom right
function sortStartCoords(startCoords) {
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
function createBasicStartBoard(board) {
    var boardMatrix = Array(COLUMNS).fill(null).map(function () { return Array(ROWS).fill(null); });
    board.forEach(function (cell, index) {
        var coords = toCoord(index);
        boardMatrix[coords.x][coords.y] = cell;
    });
    var piecesInStartingOrder = createStartingOrder(getStartingPieces());
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
function findGroup(boardMatrix, col, row, player) {
    if (boardMatrix[col][row] !== player) {
        return 0;
    }
    boardMatrix[col][row] = null;
    var size = 1;
    var directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ];
    directions.forEach(function (dir) {
        if (col + dir[0] < boardMatrix.length
            && col + dir[0] >= 0
            && row + dir[1] < boardMatrix[0].length
            && row + dir[1] >= 0) {
            size += findGroup(boardMatrix, col + dir[0], row + dir[1], player);
        }
    });
    return size;
}
function getMatchResult(G) {
    var boardMatrix = Array(COLUMNS).fill(null).map(function () { return Array(ROWS).fill(null); });
    G.board.forEach(function (cell, index) {
        var coords = toCoord(index);
        boardMatrix[coords.x][coords.y] = cell.player;
    });
    var players = [0, 1];
    var player0Groups = [];
    var player1Groups = [];
    // const groups = {
    //   player0: [],
    //   player1: [],
    // };
    var size = 0;
    var _loop_1 = function (col) {
        var _loop_2 = function (row) {
            players.forEach(function (player) {
                if (boardMatrix[col][row] === player) {
                    size = findGroup(boardMatrix, col, row, player);
                    if (size > 0) {
                        player === 0
                            ? player0Groups.push(size)
                            : player1Groups.push(size);
                        // groups[`player${player}`].push(size);
                    }
                }
            });
        };
        for (var row = 0; row < ROWS; row++) {
            _loop_2(row);
        }
    };
    for (var col = 0; col < COLUMNS; col++) {
        _loop_1(col);
    }
    // TODO refactor this part, its ugly
    if (player0Groups.length === 1 || player1Groups.length === 1) {
        if (player0Groups.length === 1 && player1Groups.length !== 1) {
            return {
                winner: '0'
            };
        }
        else if (player1Groups.length === 1 && player0Groups.length !== 1) {
            return {
                winner: '1'
            };
        }
        else if (player1Groups.length === 1 && player0Groups.length === 1) {
            return {
                draw: true
            };
        }
    }
    return null;
}
export function toIndex(coord) {
    return coord.x + coord.y * 6;
}
export function toCoord(position) {
    var x = position % 6;
    var y = Math.floor(position / 6);
    return { x: x, y: y };
}
export function areCoordsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
}
export function placePiece(G, ctx, boardIndex) {
    var board = __spreadArrays(G.board);
    var pieceType = null;
    if (ctx.turn < 2) {
        pieceType = 1;
    }
    else if (ctx.turn >= 2 && ctx.turn < 4) {
        pieceType = 2;
    }
    else {
        pieceType = 3;
    }
    board[boardIndex] = {
        id: ctx.turn,
        player: Number(ctx.currentPlayer),
        pieceType: pieceType,
    };
    var newG = __assign(__assign({}, G), { board: board, piecesPlaced: G.piecesPlaced + 1 });
    return __assign({}, newG);
}
export function getValidMoves(G, ctx, moveFrom) {
    var board = __spreadArrays(G.board);
    var actualPieceType = board[toIndex(moveFrom)].pieceType;
    if (!actualPieceType) {
        return;
    }
    var moveSet = actualPieceType - 1;
    if (moveSet < 0) {
        return;
    }
    var possibleMoves = ALL_MOVES[moveSet]
        .map(function (move) {
        var newX = moveFrom.x + move.x;
        var newY = moveFrom.y + move.y;
        return {
            x: newX,
            y: newY,
        };
    })
        .filter(function (coords) { return (coords.x <= 5 && coords.x >= 0) && (coords.y <= 6 && coords.y >= 0); })
        .filter(function (coords) { return board[toIndex(coords)].player !== Number(ctx.currentPlayer); });
    var otherPlayer = ctx.currentPlayer === '0' ? 1 : 0;
    var opponentFields = possibleMoves.filter(function (coords) { return board[toIndex(coords)].player === otherPlayer; });
    // dont jump over opponent + cant move over (knock out) too close opp
    var validMoves = [];
    if (opponentFields) {
        var vectorsToOpponents_1 = opponentFields.map(function (opponent) {
            return {
                x: opponent.x - moveFrom.x,
                y: opponent.y - moveFrom.y,
                distance: Math.max(Math.abs(opponent.x - moveFrom.x), Math.abs(opponent.y - moveFrom.y)),
            };
        });
        validMoves = possibleMoves
            .filter(function (coords) {
            var vectorToMove = {
                x: coords.x - moveFrom.x,
                y: coords.y - moveFrom.y
            };
            var standsInTheWayOrTooClose = vectorsToOpponents_1.some(function (vectorToOpp) {
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
    }
    else {
        validMoves = __spreadArrays(possibleMoves);
    }
    return validMoves;
}
export function movePiece(G, ctx, moveFrom, moveTo) {
    var validMoves = getValidMoves(G, ctx, moveFrom);
    if (!validMoves) {
        return;
    }
    var board = __spreadArrays(G.board);
    if (!validMoves.find(function (dir) { return R.equals(dir, moveTo); })) {
        return INVALID_MOVE;
    }
    else {
        board[toIndex(moveTo)] = board[toIndex(moveFrom)];
        board[toIndex(moveFrom)] = EMPTY_FIELD;
        var newG = __assign(__assign({}, G), { board: board });
        return __assign({}, newG);
    }
}
export var KaticaGame = {
    name: 'katica',
    setup: function () { return ({
        board: createBasicStartBoard(initialBoard),
        piecesPlaced: 18,
    }); },
    minPlayers: 2,
    maxPlayers: 2,
    moves: {
        placePiece: placePiece,
        movePiece: movePiece,
    },
    turn: {
        moveLimit: 1,
    },
    // flow: {
    // movesPerTurn: 1,
    // use Place here if advantage activated
    // startingPhase: Phase.Move,
    phases: {
        Place: {
            // allowedMoves: ['placePiece'],
            start: true,
            moves: { placePiece: placePiece },
            endIf: function (G) { return (G.piecesPlaced >= 18); },
            next: Phase.Move,
        },
        Move: {
            // allowedMoves: ['movePiece'],
            moves: { movePiece: movePiece },
        },
    },
    // },
    endIf: function (G, ctx) {
        if (ctx.turn > 5) {
            var result = getMatchResult(G);
            if (result) {
                return result;
            }
        }
    },
};
