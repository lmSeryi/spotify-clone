import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";

import firebase from "../../../utils/firebase";
import "firebase/storage";

import "./BannerArtist.scss";

const BannerArtist = ({ artist }) => {
  const [bannerUrl, setBannerUrl] = useState(null);

  const getBanner = async () => {
    const url = await firebase
      .storage()
      .ref(`artists/${artist.banner}`)
      .getDownloadURL();

    setBannerUrl(url);
  };

  useEffect(() => {
    getBanner();
  }, []);

  return (
    <div
      className="banner-artist"
      style={{ backgroundImage: `url(${bannerUrl})` }}
    >
      <div className="banner-artist__gradient" />
      <div className="banner-artist__info">
        <h4>Artista</h4>
        <h1>{artist.name}</h1>
      </div>
    </div>
  );
};

BannerArtist.propTypes = {
  artist: PropTypes.object,
};

export default BannerArtist;
