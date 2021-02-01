import React, { useState, useCallback } from "react";

import { Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

import firebase from "../../utils/firebase";
import "firebase/storage";
import "firebase/auth";

import NoAvatar from "../../assets/png/user.png";

const UploadAvatar = ({ user, setReloadApp }) => {
  const [avatar, setAvatar] = useState(user.photoURL);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setAvatar(URL.createObjectURL(file));
    await uploadImage(file);
    await updateUserAvatar();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "images/jpeg, image/png, image/jpg",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = async (file) => {
    try {
      const ref = firebase.storage().ref().child(`Avatar/${user.uid}`);
      await ref.put(file);
    } catch (e) {
      toast.error("Error al actualizar la imagen");
    }
  };

  const updateUserAvatar = async () => {
    try {
      const url = await firebase
        .storage()
        .ref(`Avatar/${user.uid}`)
        .getDownloadURL();

      await firebase.auth().currentUser.updateProfile({ photoURL: url });
      setReloadApp((state) => !state);
    } catch (e) {
      toast.error("Error al actualizar la iamgen");
    }
  };

  return (
    <div className="user-avatar" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Image src={NoAvatar} />
      ) : (
        <Image src={avatar ? avatar : NoAvatar} />
      )}
    </div>
  );
};

export default UploadAvatar;
