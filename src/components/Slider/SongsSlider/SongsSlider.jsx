import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import Slider from "react-slick";
import { Icon } from "semantic-ui-react";

import firebase from "../../../utils/firebase";
import "firebase/firestore";
import "firebase/storage";

import "./SongsSlider.scss";

const db = firebase.firestore(firebase);

const SongsSlider = ({ title, data, playerSong }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    className: "songs-slider__list",
  };

  return (
    data.length > 5 && (
      <div className="songs-slider">
        <h2>{title}</h2>
        <Slider {...settings}>
          {data.map((item) => (
            <Song key={item.id} item={item} playerSong={playerSong} />
          ))}
        </Slider>
      </div>
    )
  );
};

function Song({ item, playerSong }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [album, setAlbum] = useState(null);

  const getAlbum = async () => {
    try {
      const doc = await db.collection("Albums").doc(item.album).get();
      const data = doc.data();
      const id = doc.id;
      setAlbum({ id, ...data });
    } catch (error) {}
  };

  const getImageUrl = async () => {
    try {
      const url = await firebase
        .storage()
        .ref(`album/${album.banner}`)
        .getDownloadURL();
      setImageUrl(url);
    } catch (error) {}
  };

  const onPlay = async () => {
    playerSong(imageUrl, item.name, item.fileName);
  };

  useEffect(() => {
    !album && getAlbum();
    album && getImageUrl();
  }, [album]);

  return (
    <div className="songs-slider__list-song">
      <div
        className="avatar"
        style={{ backgroundImage: `url(${imageUrl})` }}
        onClick={onPlay}
      >
        <Icon name="play circle outline" />
      </div>
      <Link to={`/album/${album?.id}`}>
        <h3>{item.name}</h3>
      </Link>
    </div>
  );
}

Song.propTypes = {
  item: PropTypes.object.isRequired,
  playerSong: PropTypes.func.isRequired,
};

SongsSlider.propTypes = {
  title: PropTypes.string.isRequired,
  playerSong: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default SongsSlider;
