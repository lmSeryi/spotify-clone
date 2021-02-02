import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { Grid } from "semantic-ui-react";

import firebase from "../../utils/firebase";
import "firebase/firestore";

import "./Artists.scss";

const db = firebase.firestore(firebase);

const Artists = () => {
  const [artists, setArtists] = useState([]);

  const getArtists = async () => {
    let artists = [];
    const snapshots = await db.collection("Artists").get();

    snapshots.size !== 0 &&
      snapshots.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        artists = [...artists, { id, ...data }];
      });

    setArtists(artists);
  };

  useEffect(() => {
    artists.length === 0 && getArtists();
  }, []);

  return (
    <div className="artists">
      <h1>Artistas</h1>
      {artists.length !== 0 && (
        <Grid>
          {artists.map((artist) => (
            <Grid.Column key={artist.id} mobile={8} tablet={4} computer={3}>
              <Artist artist={artist} />
            </Grid.Column>
          ))}
        </Grid>
      )}
    </div>
  );
};

function Artist({ artist }) {
  const [banner, setBanner] = useState(null);

  const getBanner = async () => {
    const url = await firebase
      .storage()
      .ref(`artists/${artist.banner}`)
      .getDownloadURL();

    setBanner(url);
  };

  useEffect(() => {
    getBanner();
  }, []);

  return (
    <Link to={`/artist/${artist.id}`}>
      <div className="artists__item">
        <div className="avatar" style={{ backgroundImage: `url(${banner})` }} />
        <h3>{artist.name}</h3>
      </div>
    </Link>
  );
}

export default Artists;
