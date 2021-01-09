import React from "react";
import { Route, Switch } from "react-router-dom";
import { Lobby } from "../components/Lobby/Lobby";

export const LobbyRoutes = () => {
  return (
    <Switch>
      <Route exact path="/lobby" component={Lobby} />
    </Switch>
  );
}