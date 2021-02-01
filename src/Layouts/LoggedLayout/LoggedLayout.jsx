import React, { useState } from "react";

import { BrowserRouter as Router } from "react-router-dom";

import { Grid } from "semantic-ui-react";

import Routes from "../../routes/routes";
import MenuLeft from "../../components/MenuLeft";

import "./LoggedLayout.scss";
import TopBar from "../../components/TopBar/TopBar";

const LoggedLayout = ({ user, setReloadApp }) => {
  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column width={3}>
            <MenuLeft user={user} />
          </Grid.Column>
          <Grid.Column className="content" width={13}>
            <TopBar user={user} />
            <Routes user={user} setReloadApp={setReloadApp} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <h2>Player</h2>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
};

export default LoggedLayout;
