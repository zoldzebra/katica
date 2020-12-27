import React, { FC, useEffect, useState } from "react";
import firebase from "firebase/app";

import firebaseApp from "./firebaseApp";

// source:
// https://medium.com/wesionary-team/react-firebase-authentication-with-context-api-a770975f33cf
type ContextProps = {
  user: firebase.User | null;
  authenticated: boolean;
  setUser: any;
  loadingAuthState: boolean;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState(null as firebase.User | null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user: any) => {
      setUser(user);
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