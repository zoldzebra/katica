/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Lobby } from 'boardgame.io/react';
import { TicTacToeBoard } from '../Games/TicTacToe/Board';
import { TicTacToe } from '../Games/TicTacToe/Game';
import { Board as KaticaBoard } from '../Games/Katica/Board';
import { KaticaGame } from '../Games/Katica/Game';
import { APP_PRODUCTION, LOCAL_SERVER_URL } from '../config';

const { protocol, hostname, port } = window.location;
const server = APP_PRODUCTION
  ? `${protocol}//${hostname}:${port}`
  : LOCAL_SERVER_URL;
console.log('server', server);
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const importedGames = [
  { game: TicTacToe, board: TicTacToeBoard },
  { game: KaticaGame, board: KaticaBoard },
];

export const LobbyComponent = (): JSX.Element => (
  <div>
    <h1>Lobby</h1>
    <Lobby
      gameServer={server}
      lobbyServer={server}
      gameComponents={importedGames}
    />
  </div>
);