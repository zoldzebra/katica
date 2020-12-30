import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import { AuthContext } from "../components/AuthProvider/AuthProvider";
import { ProtectedRoute } from "./PrivateRoute";
import { AuthRoutes } from "./AuthRoutes";
import { LobbyRoutes } from "./LobbyRoutes";

export const AppRoutes = () => {
  const { authenticated, loadingAuthState } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <ProtectedRoute
          path="/lobby"
          component={LobbyRoutes}
          isAuthenticated={authenticated}
          authenticationPath="/auth"
          isLoadingAuthState={loadingAuthState}
        />
        <Route path="/auth" component={AuthRoutes} />
        <Redirect to="/auth" from="/" />
      </Switch>
    </Router>
  );
}
