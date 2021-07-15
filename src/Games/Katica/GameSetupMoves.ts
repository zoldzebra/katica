import { IG } from './Game';
import { Piece, createAdvantageStartBoard } from './GameCreateStartingBoard';
import { getActualPlayerColors } from './GamePieceMoves';

export function signAgreement(G: IG, ctx: any) {
  console.log('signAgreement ran.');
  let newPlayer0Agreed = G.player0Agreed;
  let newPlayer1Agreed = G.player1Agreed;
  if (ctx.currentPlayer === '0') {
    newPlayer0Agreed = true;
  } else {
    newPlayer1Agreed = true;
  }
  return {
    ...G,
    player0Agreed: newPlayer0Agreed,
    player1Agreed: newPlayer1Agreed,
  }
}

export function setAdvantage(G: IG, ctx: any, advantage: number, originalStartingBoard: Piece[]) {
  let newPlayer0Agreed = false;
  let newPlayer1Agreed = false;
  let newBoard = originalStartingBoard;
  if (ctx.currentPlayer === '0') {
    newPlayer0Agreed = true;
  } else {
    newPlayer1Agreed = true;
  }
  const starterColor = getActualPlayerColors(G.isPlayer0Red, Number(G.matchStarter));
  newBoard = createAdvantageStartBoard(originalStartingBoard, advantage, starterColor.actualPlayer);

  return {
    ...G,
    board: newBoard,
    advantage,
    player0Agreed: newPlayer0Agreed,
    player1Agreed: newPlayer1Agreed,
  }
}

export function setMatchType(G: IG, ctx: any, isAdvantageMatch: boolean) {
  let newPlayer0Agreed = false;
  let newPlayer1Agreed = false;
  if (ctx.currentPlayer === '0') {
    newPlayer0Agreed = true;
  } else {
    newPlayer1Agreed = true;
  }
  return {
    ...G,
    isAdvantageMatch,
    player0Agreed: newPlayer0Agreed,
    player1Agreed: newPlayer1Agreed,
  }
}

export function setMatchStarter(G: IG, ctx: any, matchStarter: string) {
  let newPlayer0Agreed = false;
  let newPlayer1Agreed = false;
  if (ctx.currentPlayer === '0') {
    newPlayer0Agreed = true;
  } else {
    newPlayer1Agreed = true;
  }
  return {
    ...G,
    matchStarter,
    player0Agreed: newPlayer0Agreed,
    player1Agreed: newPlayer1Agreed,
  }
}

export function switchPlayerColors(G: IG, ctx: any) {
  let newPlayer0Agreed = false;
  let newPlayer1Agreed = false;
  if (ctx.currentPlayer === '0') {
    newPlayer0Agreed = true;
  } else {
    newPlayer1Agreed = true;
  }
  const newIsPlayer0Red = !G.isPlayer0Red;
  return {
    ...G,
    isPlayer0Red: newIsPlayer0Red,
    player0Agreed: newPlayer0Agreed,
    player1Agreed: newPlayer1Agreed,
  }
}
