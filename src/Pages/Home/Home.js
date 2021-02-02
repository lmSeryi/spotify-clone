import React, { useState, useEffect } from "react";

import BannerHome from "../../components/BannerHome/Banner";
import BasicSliderItems from "./../../components/Slider/BasicSliderItems";

import { toast } from "react-toastify";

import firebase from "../../utils/firebase";
import "firebase/firestore";

import "./Home.scss";
import SongsSlider from "../../components/Slider/SongsSlider";

const db = firebase.firestore(firebase);

const Home = ({ playerSong }) => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  const getArtists = async () => {
    let artists = [];
    try {
      const snapshot = await db.collection("Artists").get();
      snapshot.size !== 0 &&
        snapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          artists = [...artists, { id, ...data }];
        });
      setArtists(artists);
    } catch (error) {
      toast.error("Error al obtener los datos");
    }
  };

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

  const getSongs = async () => {
    let songs = [];
    try {
      const snapshot = await db.collection("Songs").get();
      snapshot.size !== 0 &&
        snapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          songs = [...songs, { id, ...data }];
        });
      setSongs(songs);
    } catch (error) {
      toast.error("Error al obtener los datos");
    }
  };

  useEffect(() => {
    artists.length === 0 && getArtists();
    albums.length === 0 && getAlbums();
    songs.length === 0 && getSongs();
  }, []);

  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title="Ultimos artitas"
          data={artists}
          folderImage="artists"
          urlName="artist"
        />
        <BasicSliderItems
          title="Últimos álbumes"
          data={albums}
          folderImage="album"
          urlName="albums"
        />
        <SongsSlider
          title="Últimas canciones"
          data={songs}
          playerSong={playerSong}
        />
      </div>
    </>
  );
};

export default Home;
