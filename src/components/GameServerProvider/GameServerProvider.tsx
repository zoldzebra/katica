import React, { FC } from "react";

import { LOCAL_SERVER_PORT } from '../../config';

type ContextProps = {
  gameServer: string;
};

export const GameServerContext = React.createContext<Partial<ContextProps>>({});

export const GameServerProvider: FC = ({ children }) => {
  const LOCAL_SERVER_URL = `http://localhost:${LOCAL_SERVER_PORT}`;
  const APP_PRODUCTION = process.env.NODE_ENV === 'production';
  const { protocol, hostname, port } = window.location;
  const gameServer = APP_PRODUCTION
    ? `${protocol}//${hostname}:${port}`
    : LOCAL_SERVER_URL;

  return (
    <GameServerContext.Provider
      value={{
        gameServer
      }}>
      {children}
    </GameServerContext.Provider>
  );
};