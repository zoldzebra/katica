import React from 'react';

import { AuthProvider } from "./Firebase/FireBaseAuthProvider";
import { AppRoutes } from './Routes/AppRoutes';

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App;
