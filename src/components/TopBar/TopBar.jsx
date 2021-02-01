import React, { useState } from "react";

import { Icon, Image, Button } from "semantic-ui-react";

import { Link, withRouter } from "react-router-dom";

import firebase from "../../utils/firebase";
import "firebase/auth";

import UserImage from "../../assets/png/user.png";

import "./TopBar.scss";
import BasicModal from "./../Modal/BasicModal";

const TopBar = ({ user, history }) => {
  const [visible, setVisible] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [contentModal, setContentModal] = useState(null);

  const logout = () => {
    setVisible(true);
    setTitleModal("¿Seguro que quieres cerrar sesión?");
    setContentModal(LogoutConfirm(setVisible, setTitleModal, setContentModal));
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar__left">
          <Icon onClick={goBack} name="angle left" />
        </div>
        <div className="top-bar__right">
          <Link to="/settings">
            <Image src={user.photoURL ? user.photoURL : UserImage} />
            {user.displayName}
          </Link>
          <Icon name="power off" onClick={logout} />
        </div>
      </div>
      <BasicModal visible={visible} setVisible={setVisible} title={titleModal}>
        {contentModal}
      </BasicModal>
    </>
  );
};

const LogoutConfirm = (setVisible, setTitleModal, setContentModal) => {
  const onAccept = async () => {
    setVisible(false);
    setTitleModal("");
    setContentModal(null);

    await firebase.auth().signOut();
  };

  const onCancel = () => {
    setVisible(false);
    setTitleModal("");
    setContentModal(null);
  };

  return (
    <div className="buttons">
      <Button className="accept" onClick={onAccept}>
        Aceptar
      </Button>
      <Button className="cancel" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  );
};

export default withRouter(TopBar);
