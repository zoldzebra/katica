import React from 'react';

import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { AppRoutes } from './Routes/AppRoutes';

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App;
