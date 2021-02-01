import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

import firebase from "../../utils/firebase";
import "firebase/storage";

import "./Banner.scss";

const BannerHome = () => {
  const [bannerUrl, setBannerUrl] = useState("");

  const getBanner = async () => {
    try {
      const url = await firebase
        .storage()
        .ref("others/banner-home.jpg")
        .getDownloadURL();
      setBannerUrl(url);
    } catch (error) {
      toast.error("Error al obtener el banner");
    }
  };

  useEffect(() => {
    getBanner();
  }, []);

  return (
    bannerUrl && (
      <div
        className="banner-home"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
    )
  );
};

export default BannerHome;
