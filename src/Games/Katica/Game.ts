
import {
  Piece,
  createBasicStartBoard,
  emptyBoardAsList,
} from './GameCreateStartingBoard';
import { movePiece } from './GamePieceMoves';
import { getMatchResult } from './GameResult';
import {
  signAgreement,
  setAdvantage,
  setMatchType,
  setMatchStarter,
  switchPlayerColors,
} from './GameSetupMoves';

export enum Phase {
  MatchType = 'MatchType',
  ChooseColor = 'ChooseColor',
  MatchStarter = 'MatchStarter',
  SetAdvantage = 'SetAdvantage',
  Move = 'Move',
}

export interface IG {
  board: Piece[];
  isAdvantageMatch: boolean;
  isPlayer0Red: boolean;
  matchStarter: string;
  advantage: string;
  player0Agreed: boolean;
  player1Agreed: boolean;
}

const setupGame = (ctx: any): IG => {
  const mainBoard = createBasicStartBoard(emptyBoardAsList, ctx);
  return {
    board: mainBoard,
    isAdvantageMatch: false,
    isPlayer0Red: true,
    matchStarter: ctx.playOrder[0],
    advantage: '',
    player0Agreed: false,
    player1Agreed: false,
  }
}

const nextPlayerTurn = (ctx: any): number => {
  return (ctx.playOrderPos + 1) % ctx.numPlayers;
}

const isBothPlayersAgreed = (G: IG) => {
  return G.player0Agreed && G.player1Agreed;
}

export const KaticaGame = {
  name: 'katica',

  setup: setupGame,

  minPlayers: 2,
  maxPlayers: 2,

  moves: {
    setMatchType,
    switchPlayerColors,
    setMatchStarter,
    setAdvantage,
    signAgreement,
    movePiece,
  },

  turn: {
    moveLimit: 1,
  },

  phases: {
    MatchType: {
      start: true,
      moves: { setMatchType, signAgreement },
      endIf: (G: IG) => {
        if (isBothPlayersAgreed(G)) {
          return { next: G.isAdvantageMatch ? Phase.ChooseColor : Phase.Move }
        }
      },
      onEnd: (G: IG) => {
        return {
          ...G,
          player0Agreed: false,
          player1Agreed: false,
        }
      }
    },
    ChooseColor: {
      moves: { switchPlayerColors, signAgreement },
      endIf: (G: IG) => (isBothPlayersAgreed(G)),
      onEnd: (G: IG) => {
        return {
          ...G,
          player0Agreed: false,
          player1Agreed: false,
        }
      },
      next: Phase.MatchStarter,
    },
    MatchStarter: {
      moves: { setMatchStarter, signAgreement },
      endIf: (G: IG) => (isBothPlayersAgreed(G)),
      onEnd: (G: IG) => {
        return {
          ...G,
          player0Agreed: false,
          player1Agreed: false,
        }
      },
      next: Phase.SetAdvantage,
    },
    SetAdvantage: {
      moves: { setAdvantage, signAgreement },
      endIf: (G: IG) => (isBothPlayersAgreed(G)),
      next: Phase.Move
    },
    Move: {
      moves: { movePiece },
      turn: {
        moveLimit: 1,
        order: {
          first: (G: IG, ctx: any) => {
            if (!G.isAdvantageMatch) {
              return Math.round(ctx.random.Number());
            }
            return Number(G.matchStarter);
          },
          next: (GIgnored: IG, ctx: any) => nextPlayerTurn(ctx),
        }
      }
    },
  },

  endIf: (G: any, ctx: any) => {
    if (ctx.turn > 5) {
      const result = getMatchResult(G);
      if (result) {
        return result;
      }
    }
  },
};
