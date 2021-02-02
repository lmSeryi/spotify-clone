import React, { useState } from "react";

import { BrowserRouter as Router } from "react-router-dom";

import { Grid } from "semantic-ui-react";

import Routes from "../../routes/routes";
import MenuLeft from "../../components/MenuLeft";

import "./LoggedLayout.scss";
import TopBar from "../../components/TopBar";
import Player from "../../components/Player";

import firebase from "../../utils/firebase";
import "firebase/storage";
import { toast } from "react-toastify";

const LoggedLayout = ({ user, setReloadApp }) => {
  const [songData, setSongData] = useState(null);

  const playerSong = async (albumImage, songName, songUrl) => {
    try {
      const url = await firebase
        .storage()
        .ref(`song/${songUrl}`)
        .getDownloadURL();

      setSongData({
        image: albumImage,
        name: songName,
        url,
      });
    } catch (error) {
      toast.error("Error al reproducir la canción.");
    }
  };

  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column width={3}>
            <MenuLeft user={user} />
          </Grid.Column>
          <Grid.Column className="content" width={13}>
            <TopBar user={user} />
            <Routes
              user={user}
              setReloadApp={setReloadApp}
              playerSong={playerSong}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Player songData={songData} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
};

export default LoggedLayout;
