/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-undef */
import React from 'react';
import { Lobby } from 'boardgame.io/react';
import { TicTacToeBoard } from './Games/TicTacToe/Board';
import { TicTacToe } from './Games/TicTacToe/Game';
import { Board as KaticaBoard } from './Games/Katica/board';
import { KaticaGame } from './Games/Katica/game';


const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;
console.log('Lobby server', server);
const importedGames = [
  { game: TicTacToe, board: TicTacToeBoard },
  { game: KaticaGame, board: KaticaBoard },
];

export const LobbyComponent = () => (
  <div>
    <h1>Lobby</h1>
    <Lobby
      gameServer={server}
      lobbyServer={server}
      gameComponents={importedGames}
    />
  </div>
);