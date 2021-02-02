import React, { useState, useEffect } from "react";

import { withRouter, Link } from "react-router-dom";

import { toast } from "react-toastify";

import { Loader } from "semantic-ui-react";

import ListSongs from "../../components/Songs/ListSongs";

import firebase from "../../utils/firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Album.scss";

const db = firebase.firestore(firebase);

const Album = ({ match, playerSong }) => {
  const { params } = match;
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albumImage, setAlbumImage] = useState(null);
  const [artist, setArtist] = useState(null);

  const getAlbum = async () => {
    try {
      const doc = await db.collection("Albums").doc(params.id).get();
      const data = doc.data();
      setAlbum(data);
    } catch (error) {
      toast.error("Error al obtener la información");
    }
  };

  const getImage = async () => {
    try {
      const url = await firebase
        .storage()
        .ref(`album/${album.banner}`)
        .getDownloadURL();
      setAlbumImage(url);
    } catch (error) {
      toast.error("Error al obtener la información del album");
    }
  };

  const getArtist = async () => {
    try {
      const doc = await db.collection("Artists").doc(album.artist).get();
      const id = doc.id;
      const data = doc.data();
      setArtist({ ...data, id });
    } catch (error) {
      toast.error("Error al obtener la información del artista");
    }
  };

  const getSongs = async () => {
    let songs = [];
    try {
      const snapshot = await db
        .collection("Songs")
        .where("album", "==", params.id)
        .get();

      snapshot.size !== 0 &&
        snapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          songs = [...songs, { id, ...data }];
        });

      setSongs(songs);
    } catch (error) {}
  };

  useEffect(() => {
    !album && getAlbum();
    album && getImage();
    album && getArtist();
    album && getSongs();
  }, [album]);

  return !album || !artist ? (
    <Loader active>Cargando</Loader>
  ) : (
    <div className="album">
      <div className="album__header">
        <HeaderAlbum albumImage={albumImage} album={album} artist={artist} />
      </div>
      <div className="album__songs">
        <ListSongs
          songs={songs}
          albumImage={albumImage}
          playerSong={playerSong}
        />
      </div>
    </div>
  );
};

function HeaderAlbum({ album, artist, albumImage }) {
  return (
    <>
      <div
        className="image"
        style={{ backgroundImage: `url(${albumImage})` }}
      />
      <div className="info">
        <h1>{album.name}</h1>
        <p>
          De{" "}
          <Link to={`/artist/${artist.id}`}>
            <span>{artist.name}</span>
          </Link>
        </p>
      </div>
    </>
  );
}

export default withRouter(Album);
