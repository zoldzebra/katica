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
import { INVALID_MOVE } from 'boardgame.io/core';
import * as R from 'ramda';
import { toIndex, areCoordsEqual } from './GameCoordCalculations';
import { ALL_MOVES, EMPTY_FIELD } from './GameConstants';
export function getValidMoves(G, ctx, moveFrom) {
    var board = __spreadArrays(G.board);
    var actualPieceType = board[toIndex(moveFrom)].pieceType;
    if (!actualPieceType) {
        return null;
    }
    var moveSet = actualPieceType - 1;
    if (moveSet < 0) {
        return null;
    }
    var playerColors = getActualPlayerColors(G.isPlayer0Red, Number(ctx.currentPlayer));
    var possibleMoves = ALL_MOVES[moveSet]
        .map(function (move) {
        var newX = moveFrom.x + move.x;
        var newY = moveFrom.y + move.y;
        return {
            x: newX,
            y: newY,
        };
    })
        // TODO: use constants here
        .filter(function (coords) { return (coords.x <= 5 && coords.x >= 0) && (coords.y <= 6 && coords.y >= 0); })
        .filter(function (coords) { return board[toIndex(coords)].color !== playerColors.actualPlayer; });
    var opponentFields = possibleMoves.filter(function (coords) { return board[toIndex(coords)].color === playerColors.otherPlayer; });
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
        return INVALID_MOVE;
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
export var getActualPlayerColors = function (isPlayer0Red, currentPlayer) {
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
};
