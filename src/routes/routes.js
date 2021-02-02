import React from "react";

import { Switch, Route } from "react-router-dom";
import Artist from "../Pages/Artist";

import Home from "../Pages/Home";
import Settings from "../Pages/Settings";
import Artists from "./../Pages/Artists";
import Albums from "./../Pages/Albums";
import Album from "./../Pages/Album";

export default function Routes({ user, setReloadApp, playerSong }) {
  return (
    <Switch>
      <Route path="/" exact>
        <Home playerSong={playerSong} />
      </Route>
      <Route path="/artists" component={Artists} exact />
      <Route path="/artist/:id" exact>
        <Artist playerSong={playerSong} />
      </Route>
      <Route path="/albums" component={Albums} exact />
      <Route path="/album/:id" exact>
        <Album playerSong={playerSong} />
      </Route>
      <Route path="/settings" exact>
        <Settings user={user} setReloadApp={setReloadApp} />
      </Route>
    </Switch>
  );
}
