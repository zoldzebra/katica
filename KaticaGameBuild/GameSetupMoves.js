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
import { createAdvantageStartBoard } from './GameCreateStartingBoard';
import { getActualPlayerColors } from './GamePieceMoves';
export function signAgreement(G, ctx) {
    console.log('signAgreement ran.');
    var newPlayer0Agreed = G.player0Agreed;
    var newPlayer1Agreed = G.player1Agreed;
    if (ctx.currentPlayer === '0') {
        newPlayer0Agreed = true;
    }
    else {
        newPlayer1Agreed = true;
    }
    return __assign(__assign({}, G), { player0Agreed: newPlayer0Agreed, player1Agreed: newPlayer1Agreed });
}
export function setAdvantage(G, ctx, advantage, originalStartingBoard) {
    var newPlayer0Agreed = false;
    var newPlayer1Agreed = false;
    var newBoard = originalStartingBoard;
    if (ctx.currentPlayer === '0') {
        newPlayer0Agreed = true;
    }
    else {
        newPlayer1Agreed = true;
    }
    var starterColor = getActualPlayerColors(G.isPlayer0Red, Number(G.matchStarter));
    newBoard = createAdvantageStartBoard(originalStartingBoard, advantage, starterColor.actualPlayer);
    return __assign(__assign({}, G), { board: newBoard, advantage: advantage, player0Agreed: newPlayer0Agreed, player1Agreed: newPlayer1Agreed });
}
export function setMatchType(G, ctx, isAdvantageMatch) {
    var newPlayer0Agreed = false;
    var newPlayer1Agreed = false;
    if (ctx.currentPlayer === '0') {
        newPlayer0Agreed = true;
    }
    else {
        newPlayer1Agreed = true;
    }
    return __assign(__assign({}, G), { isAdvantageMatch: isAdvantageMatch, player0Agreed: newPlayer0Agreed, player1Agreed: newPlayer1Agreed });
}
export function setMatchStarter(G, ctx, matchStarter) {
    var newPlayer0Agreed = false;
    var newPlayer1Agreed = false;
    if (ctx.currentPlayer === '0') {
        newPlayer0Agreed = true;
    }
    else {
        newPlayer1Agreed = true;
    }
    return __assign(__assign({}, G), { matchStarter: matchStarter, player0Agreed: newPlayer0Agreed, player1Agreed: newPlayer1Agreed });
}
export function switchPlayerColors(G, ctx) {
    var newPlayer0Agreed = false;
    var newPlayer1Agreed = false;
    if (ctx.currentPlayer === '0') {
        newPlayer0Agreed = true;
    }
    else {
        newPlayer1Agreed = true;
    }
    var newIsPlayer0Red = !G.isPlayer0Red;
    return __assign(__assign({}, G), { isPlayer0Red: newIsPlayer0Red, player0Agreed: newPlayer0Agreed, player1Agreed: newPlayer1Agreed });
}
