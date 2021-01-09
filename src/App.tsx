import React from 'react';

import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { GameServerProvider } from './components/GameServerProvider/GameServerProvider';
import { AppRoutes } from './Routes/AppRoutes';

const App = () => {
  return (
    <AuthProvider>
      <GameServerProvider>
        <AppRoutes />
      </GameServerProvider>
    </AuthProvider>
  )
}

export default App;
