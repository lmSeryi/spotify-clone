import React, { useState, useEffect } from "react";

import BannerHome from "../../components/BannerHome/Banner";

import { toast } from "react-toastify";

import firebase from "../../utils/firebase";
import "firebase/firestore";

import "./Home.scss";

const db = firebase.firestore(firebase);

const Home = () => {
  const [artists, setArtists] = useState([]);

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

  useEffect(() => {
    artists.length === 0 && getArtists();
  }, []);

  return (
    <>
      {console.log(artists)}
      <BannerHome />
      <div className="home">
        <h2>Hola Mundo</h2>
      </div>
    </>
  );
};

export default Home;
