import React, { useState } from "react";

import UploadAvatar from "../../components/Settings/UploadAvatar";
import UserEmail from "../../components/Settings/UserEmail";
import UserName from "../../components/Settings/UserName";
import BasicModal from "./../../components/Modal/BasicModal/BasicModal";

import "./Settings.scss";
import UserPassword from "./../../components/Settings/UserPassword";

const Settings = ({ user, setReloadApp }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);

  return (
    <div className="settings">
      <h1>Configuración</h1>
      <div className="avatar-name">
        <UploadAvatar user={user} setReloadApp={setReloadApp} />
        <UserName
          user={user}
          setVisible={setVisible}
          setTitle={setTitle}
          setContent={setContent}
          setReloadApp={setReloadApp}
        />
      </div>
      <UserEmail
        user={user}
        setVisible={setVisible}
        setTitle={setTitle}
        setContent={setContent}
        setReloadApp={setReloadApp}
      />
      <UserPassword
        setVisible={setVisible}
        setTitle={setTitle}
        setContent={setContent}
      />
      <BasicModal visible={visible} setVisible={setVisible} title={title}>
        {content}
      </BasicModal>
    </div>
  );
};

export default Settings;
