import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import Slider from "react-slick";

import firebase from "../../../utils/firebase";
import "firebase/storage";

import "./BasicSliderItems.scss";

const BasicSliderItems = ({ data, title, folderImage, urlName }) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    className: "basic-slider-items__list",
  };

  return data.length >= 3 ? (
    <div className="basic-slider-items">
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((item) => (
          <RenderItem
            key={item.id}
            item={item}
            folderImage={folderImage}
            urlName={urlName}
          />
        ))}
      </Slider>
    </div>
  ) : null;
};

const RenderItem = ({ item, folderImage, urlName }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const getBanner = async () => {
    try {
      const url = await firebase
        .storage()
        .ref(`${folderImage}/${item.banner}`)
        .getDownloadURL();
      setImageUrl(url);
    } catch (e) {}
  };

  useEffect(() => {
    getBanner();
  }, []);

  return (
    <Link to={`/${urlName}/${item.id}`}>
      <div className="basic-slider-items__list-item">
        <div
          className="avatar"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <h3>{item.name}</h3>
      </div>
    </Link>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
  folderImage: PropTypes.string.isRequired,
  urlName: PropTypes.string.isRequired,
};

BasicSliderItems.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  folderImage: PropTypes.string.isRequired,
  urlName: PropTypes.string.isRequired,
};

export default BasicSliderItems;
