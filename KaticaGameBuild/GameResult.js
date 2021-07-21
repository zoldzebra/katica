import { ROWS, COLUMNS } from './GameConstants';
import { toCoord } from './GameCoordCalculations';
import { getActualPlayerColors } from './GamePieceMoves';
function findGroup(boardColorMatrix, col, row, playerColor) {
    if (boardColorMatrix[col][row] !== playerColor) {
        return 0;
    }
    boardColorMatrix[col][row] = null;
    var size = 1;
    var directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ];
    directions.forEach(function (dir) {
        if (col + dir[0] < boardColorMatrix.length
            && col + dir[0] >= 0
            && row + dir[1] < boardColorMatrix[0].length
            && row + dir[1] >= 0) {
            size += findGroup(boardColorMatrix, col + dir[0], row + dir[1], playerColor);
        }
    });
    return size;
}
export function getMatchResult(G) {
    var boardColorMatrix = Array(COLUMNS).fill(null).map(function () { return Array(ROWS).fill(null); });
    G.board.forEach(function (cell, index) {
        var coords = toCoord(index);
        boardColorMatrix[coords.x][coords.y] = cell.color;
    });
    var players = [0, 1];
    var playerColors = getPlayerColorsOrdered(G.isPlayer0Red);
    var playerGroups = [0, 0];
    var size = 0;
    for (var col = 0; col < COLUMNS; col++) {
        for (var row = 0; row < ROWS; row++) {
            for (var player = 0; player < players.length; player++) {
                var playerColor = playerColors[player];
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
function createMatchResult(playerGroups) {
    var winnerIndex = playerGroups.findIndex(function (group) { return group === 1; });
    if (winnerIndex === -1) {
        return null;
    }
    if (playerGroups.every(function (group) { return group === 1; })) {
        return {
            draw: true
        };
    }
    return {
        winner: winnerIndex.toString()
    };
}
function getPlayerColorsOrdered(isPlayer0Red) {
    var playerColors = getActualPlayerColors(isPlayer0Red, 0);
    var player0Color = playerColors.actualPlayer;
    var player1Color = playerColors.otherPlayer;
    return [player0Color, player1Color];
}
