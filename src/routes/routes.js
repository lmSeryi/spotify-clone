import React from "react";

import { Switch, Route } from "react-router-dom";

import Home from "../Pages/Home";
import Settings from "../Pages/Settings";

//Pages

export default function Routes({ user, setReloadApp }) {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/artists" exact>
        <h1>Artist...</h1>
      </Route>
      <Route path="/settings" exact>
        <Settings user={user} setReloadApp={setReloadApp} />
      </Route>
    </Switch>
  );
}
