import React, { FC, useEffect, useState } from "react";

import firebaseApp from "../../Firebase/firebaseApp";

export type User = {
  id: string;
  email: string;
}

// source:
// https://medium.com/wesionary-team/react-firebase-authentication-with-context-api-a770975f33cf
type ContextProps = {
  user: User | null;
  authenticated: boolean;
  setUser: any;
  loadingAuthState: boolean;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user: any) => {
      if (!user) {
        setUser(null);
      } else {
        setUser({
          id: user.uid,
          email: user.email,
        });
      }
      setLoadingAuthState(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: user !== null,
        setUser,
        loadingAuthState
      }}>
      {children}
    </AuthContext.Provider>
  );
};