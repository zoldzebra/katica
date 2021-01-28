import React from 'react';

import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Game } from "boardgame.io";

interface GameClientProps {
  game: Game;
  board: any;
  gameServer: string;
  matchID: string;
  playerID: string;
  credentials: string;
  debug: boolean;
}

export const GameClientComponent: React.FC<GameClientProps> = (props): JSX.Element => {
  const { game, board, gameServer, matchID, playerID, credentials, debug } = props;

  const BoardGameClient = Client({
    game,
    numPlayers: 2,
    board,
    multiplayer: SocketIO({
      server: gameServer,
    }),
  });

  return (
    <BoardGameClient
      matchID={matchID}
      playerID={playerID}
      credentials={credentials}
      debug={debug}
    />
  );
}