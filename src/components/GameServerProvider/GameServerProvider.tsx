import React, { FC } from "react";

import { LobbyClient } from 'boardgame.io/client';

import { LOCAL_SERVER_PORT } from '../../config';

type ContextProps = {
  gameServer: string;
  lobbyClient: LobbyClient;
};

export const GameServerContext = React.createContext<ContextProps>({} as ContextProps);

export const GameServerProvider: FC = ({ children }) => {
  const LOCAL_SERVER_URL = `http://localhost:${LOCAL_SERVER_PORT}`;
  const APP_PRODUCTION = process.env.NODE_ENV === 'production';
  const { protocol, hostname, port } = window.location;
  const gameServer = APP_PRODUCTION
    ? `${protocol}//${hostname}:${port}`
    : LOCAL_SERVER_URL;
  const lobbyClient = new LobbyClient({ server: gameServer });


  return (
    <GameServerContext.Provider
      value={{
        gameServer,
        lobbyClient,
      }}>
      {children}
    </GameServerContext.Provider>
  );
};