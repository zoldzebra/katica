import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Lobby } from './components/Lobby/Lobby';
import { Login } from './components/LoginPage/Login';



const App = () => {
  return (
    <Switch>
      <Route path="/" component={Login} exact />
      <Route path="/login" exact component={Login} />
      <Route path="/lobby" exact component={Lobby} />
    </Switch>
  )
}

export default App;
