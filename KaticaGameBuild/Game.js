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
import { createBasicStartBoard, emptyBoardAsList, } from './GameCreateStartingBoard';
import { movePiece } from './GamePieceMoves';
import { getMatchResult } from './GameResult';
import { signAgreement, setAdvantage, setMatchType, setMatchStarter, switchPlayerColors, } from './GameSetupMoves';
export var Phase;
(function (Phase) {
    Phase["MatchType"] = "MatchType";
    Phase["ChooseColor"] = "ChooseColor";
    Phase["MatchStarter"] = "MatchStarter";
    Phase["SetAdvantage"] = "SetAdvantage";
    Phase["Move"] = "Move";
})(Phase || (Phase = {}));
var setupGame = function (ctx) {
    var mainBoard = createBasicStartBoard(emptyBoardAsList, ctx);
    return {
        board: mainBoard,
        isAdvantageMatch: false,
        isPlayer0Red: true,
        matchStarter: ctx.playOrder[0],
        advantage: 0,
        player0Agreed: false,
        player1Agreed: false,
    };
};
var nextPlayerTurn = function (ctx) {
    return (ctx.playOrderPos + 1) % ctx.numPlayers;
};
var isBothPlayersAgreed = function (G) {
    return G.player0Agreed && G.player1Agreed;
};
export var KaticaGame = {
    name: 'katica',
    setup: setupGame,
    minPlayers: 2,
    maxPlayers: 2,
    moves: {
        setMatchType: setMatchType,
        switchPlayerColors: switchPlayerColors,
        setMatchStarter: setMatchStarter,
        setAdvantage: setAdvantage,
        signAgreement: signAgreement,
        movePiece: movePiece,
    },
    turn: {
        moveLimit: 1,
    },
    phases: {
        MatchType: {
            start: true,
            moves: { setMatchType: setMatchType, signAgreement: signAgreement },
            endIf: function (G) {
                if (isBothPlayersAgreed(G)) {
                    return { next: G.isAdvantageMatch ? Phase.MatchStarter : Phase.Move };
                }
            },
            onEnd: function (G) {
                return __assign(__assign({}, G), { player0Agreed: false, player1Agreed: false });
            }
        },
        MatchStarter: {
            moves: { setMatchStarter: setMatchStarter, signAgreement: signAgreement },
            endIf: function (G) { return (isBothPlayersAgreed(G)); },
            onEnd: function (G) {
                return __assign(__assign({}, G), { player0Agreed: false, player1Agreed: false });
            },
            next: Phase.ChooseColor,
        },
        ChooseColor: {
            moves: { switchPlayerColors: switchPlayerColors, signAgreement: signAgreement },
            endIf: function (G) { return (isBothPlayersAgreed(G)); },
            onEnd: function (G) {
                return __assign(__assign({}, G), { player0Agreed: false, player1Agreed: false });
            },
            next: Phase.SetAdvantage,
        },
        SetAdvantage: {
            moves: { setAdvantage: setAdvantage, signAgreement: signAgreement },
            endIf: function (G) { return (isBothPlayersAgreed(G)); },
            next: Phase.Move
        },
        Move: {
            moves: { movePiece: movePiece },
            turn: {
                moveLimit: 1,
                order: {
                    first: function (G, ctx) {
                        if (!G.isAdvantageMatch) {
                            return Math.round(ctx.random.Number());
                        }
                        return Number(G.matchStarter);
                    },
                    next: function (GIgnored, ctx) { return nextPlayerTurn(ctx); },
                }
            }
        },
    },
    endIf: function (G, ctx) {
        if (ctx.turn > 5) {
            var result = getMatchResult(G);
            if (result) {
                return result;
            }
        }
    },
};
