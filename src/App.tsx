import React, { Suspense } from 'react';

import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { GameServerProvider } from './components/GameServerProvider/GameServerProvider';
import { AppRoutes } from './Routes/AppRoutes';
import './i18n/config';

const App = () => {
  return (
    <Suspense fallback={<div>Loading language...</div>}>
      <AuthProvider>
        <GameServerProvider>
          <AppRoutes />
        </GameServerProvider>
      </AuthProvider>
    </Suspense>
  )
}

export default App;
