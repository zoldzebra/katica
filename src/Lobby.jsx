import React from 'react';
import { Lobby } from 'boardgame.io/react';
import { TicTacToeBoard } from './Board';
import { TicTacToe } from './Game';

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;
const importedGames = [{ game: TicTacToe, board: TicTacToeBoard }];

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