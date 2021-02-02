import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { Grid } from "semantic-ui-react";

import { toast } from "react-toastify";

import firebase from "../../utils/firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Albums.scss";

const db = firebase.firestore(firebase);

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  const getAlbums = async () => {
    let albums = [];
    try {
      const snapshot = await db.collection("Albums").get();
      snapshot.size !== 0 &&
        snapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          albums = [...albums, { id, ...data }];
        });
      setAlbums(albums);
    } catch (error) {
      toast.error("Error al obtener los datos");
    }
  };

  useEffect(() => {
    albums.length === 0 && getAlbums();
  }, []);

  return (
    <div className="albums">
      <h1>Álbumes</h1>
      <Grid>
        {albums.map((album) => (
          <Grid.Column key={album.id} mobile={8} target={4} computer={3}>
            <Album album={album} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
};

function Album({ album }) {
  const [albumImage, setAlbumImage] = useState(null);

  const getAlbumImage = async () => {
    const url = await firebase
      .storage()
      .ref(`album/${album.banner}`)
      .getDownloadURL();

    setAlbumImage(url);
  };

  useEffect(() => {
    !albumImage && getAlbumImage();
  }, []);

  return (
    <Link to={`/album/${album.id}`}>
      <div className="albums__item">
        <div
          className="avatar"
          style={{ backgroundImage: `url(${albumImage})` }}
        />
        <h3>{album.name}</h3>
      </div>
    </Link>
  );
}

export default Albums;
