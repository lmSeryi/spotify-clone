import React, { useState, useEffect } from "react";

import { withRouter } from "react-router-dom";

import BannerArtist from "../../components/Artists/BannerArtist";

import firebase from "../../utils/firebase";
import "firebase/firestore";

import "./Artist.scss";
import { toast } from "react-toastify";

import BasicSliderItems from "./../../components/Slider/BasicSliderItems";
import SongsSlider from "./../../components/Slider/SongsSlider";

const db = firebase.firestore(firebase);

const Artist = ({ match, playerSong }) => {
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [songs, setSongs] = useState(null);

  const { params } = match;

  const getArtist = async () => {
    try {
      const doc = await db.collection("Artists").doc(params.id).get();
      const data = doc.data();
      setArtist(data);
    } catch (error) {
      toast.error("Error al obtener la información");
    }
  };

  const getAlbums = async () => {
    let albums = [];
    try {
      const snapshot = await db
        .collection("Albums")
        .where("artist", "==", params.id)
        .get();

      snapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        albums = [...albums, { id, ...data }];
      });
      setAlbums(albums);
    } catch (error) {
      toast.error("Error al obtener los álbumes");
    }
  };

  useEffect(() => {
    getArtist();
    getAlbums();
  }, []);

  const getSongs = async () => {
    let arraySongs = [];

    albums.length !== 0 &&
      (await Promise.all(
        albums.map(async (album) => {
          const snapshot = await db
            .collection("Songs")
            .where("album", "==", album.id)
            .get();
          snapshot.forEach((doc) => {
            const id = doc.id;
            const data = doc.data();
            arraySongs = [...arraySongs, { id, ...data }];
          });

          setSongs(arraySongs);
        })
      ));
  };

  useEffect(() => {
    albums && getSongs();
  }, [albums]);

  return (
    <div className="artist">
      {artist && <BannerArtist artist={artist} />}
      <div className="artist__content" />
      {albums && (
        <BasicSliderItems
          title="Álbumes"
          data={albums}
          folderImage="album"
          urlName="album"
        />
      )}
      {songs && (
        <SongsSlider title="Canciones" data={songs} playerSong={playerSong} />
      )}
    </div>
  );
};

export default withRouter(Artist);
