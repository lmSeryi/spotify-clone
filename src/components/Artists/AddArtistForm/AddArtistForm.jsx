import React, { useState, useCallback } from "react";

import { Form, Input, Button, Image } from "semantic-ui-react";

import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import firebase from "../../../utils/firebase";
import "firebase/storage";
import "firebase/firestore";

import NoImage from "../../../assets/png/no-image.png";

import "./AddArtistForm.scss";

const db = firebase.firestore(firebase);

const AddArtistForm = ({ setVisible }) => {
  const [banner, setBanner] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [artistForm, setArtistForm] = useState(initialValueForm());

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setBanner(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/png, image/jpeg",
    noKeyboard: true,
    onDrop,
  });

  const validateForm = () => {
    if (artistForm.name.trim().length === 0) {
      toast.warning("Añade el nombre del artista.");
      return false;
    } else if (!file) {
      toast.warning("Añade la imagen del artista.");
      return false;
    }
    return true;
  };

  const uploadImage = (fileName) => {
    const ref = firebase.storage().ref().child(`artists/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const fileName = uuidv4();
      try {
        await uploadImage(fileName);
        try {
          db.collection("Artists").add({
            name: artistForm.name,
            banner: fileName,
          });
          toast.success("Artista creado correctamente");
          resetForm();
          setLoading(false);
          setVisible(false);
        } catch (e) {
          toast.error("Error al guardar los datos.");
          setLoading(false);
        }
      } catch (e) {
        toast.error("Error al subir la imagen.");
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setArtistForm(initialValueForm());
    setFile(null);
    setBanner(null);
  };

  return (
    <Form className="add-artist-form" onSubmit={onSubmit}>
      <Form.Field className="artist-banner">
        <div
          {...getRootProps()}
          className="banner"
          style={{ backgroundImage: `url(${banner})` }}
        />
        <input {...getInputProps()} disabled={loading} />
        {!banner && <Image src={NoImage} />}
      </Form.Field>
      <Form.Field className="artist-avatar">
        <div
          className="avatar"
          style={{ backgroundImage: `url(${banner ? banner : NoImage})` }}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Nombre del artista"
          onChange={(e) => setArtistForm({ name: e.target.value })}
          value={artistForm.name}
        />
      </Form.Field>
      <Button type="submit" disabled={loading} loading={loading}>
        Crear artista
      </Button>
    </Form>
  );
};

const initialValueForm = () => {
  return {
    name: "",
  };
};

export default AddArtistForm;
