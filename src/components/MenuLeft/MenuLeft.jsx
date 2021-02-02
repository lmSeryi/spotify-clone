import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";

import BasicModal from "../Modal/BasicModal";

import { isUserAdmin } from "../../utils/api";

import "./MenuLeft.scss";
import AddArtistForm from "./../Artists/AddArtistForm";
import AddAlbumForm from "./../Albums/AddAlbumForm";
import AddSongForm from "./../Songs/AddSongForm";

const MenuLeft = ({ user, location }) => {
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [isAdmin, setIsAdmin] = useState(false);
  const [visible, setVisible] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [contentModal, setContentModal] = useState(null);

  useEffect(() => {
    isUserAdmin(user.uid).then((res) => setIsAdmin(res));
    setActiveMenu(location.pathname);
  }, []);

  const handlerMenu = (e, menu) => {
    setActiveMenu(menu.to);
  };

  const handlerModal = (type) => {
    switch (type) {
      case "artist":
        setTitleModal("Nuevo Artista");
        setContentModal(<AddArtistForm setVisible={setVisible} />);
        setVisible(true);
        break;
      case "song":
        setTitleModal("Nueva Canción");
        setContentModal(<AddSongForm setVisible={setVisible} />);
        setVisible(true);
        break;
      case "album":
        setTitleModal("Nuevo Album");
        setContentModal(<AddAlbumForm setVisible={setVisible} />);
        setVisible(true);
        break;
      default:
        setTitleModal("");
        setContentModal(null);
        setVisible(false);
        break;
    }
  };

  return (
    <>
      <Menu className="menu-left" vertical>
        <div className="top">
          <Menu.Item
            as={Link}
            to="/"
            name="home"
            active={activeMenu === "/"}
            onClick={handlerMenu}
          >
            <Icon name="home" /> Inicio
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/artists"
            active={activeMenu === "/artists"}
            name="artists"
            onClick={handlerMenu}
          >
            <Icon name="user" /> Artistas
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/albums"
            active={activeMenu === "/albums"}
            name="albums"
            onClick={handlerMenu}
          >
            <Icon name="window maximize outline" /> Álbumes
          </Menu.Item>
        </div>
        {isAdmin && (
          <div className="footer">
            <Menu.Item onClick={() => handlerModal("song")}>
              <Icon name="plus square outline" /> Nueva Canción
            </Menu.Item>
            <Menu.Item onClick={() => handlerModal("album")}>
              <Icon name="plus square outline" /> Nuevo Album
            </Menu.Item>
            <Menu.Item onClick={() => handlerModal("artist")}>
              <Icon name="plus square outline" /> Nuevo Artista
            </Menu.Item>
          </div>
        )}
      </Menu>
      <BasicModal visible={visible} setVisible={setVisible} title={titleModal}>
        {contentModal}
      </BasicModal>
    </>
  );
};

export default withRouter(MenuLeft);
