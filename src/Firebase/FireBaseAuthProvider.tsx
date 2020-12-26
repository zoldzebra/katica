import React, { FC, useEffect, useState } from "react";
import firebase from "firebase/app";

import firebaseApp from "./firebaseConfig";

type ContextProps = {
  user: firebase.User | null;
  authenticated: boolean;
  setUser: any;
  loadingAuthState: boolean;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState(null as firebase.User | null);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};