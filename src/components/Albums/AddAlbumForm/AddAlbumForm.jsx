import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import { Form, Input, Button, Image, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";

import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import firebase from "../../../utils/firebase";
import "firebase/firestore";
import "firebase/storage";

import NoImage from "../../../assets/png/no-image.png";

import "./AddAlbumForm.scss";

const db = firebase.firestore(firebase);

const AddAlbumForm = ({ setVisible }) => {
  const [albumImage, setAlbumImage] = useState(null);
  const [artists, setArtists] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(initialValueForm());

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setAlbumImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/png, image/jpeg, image/jpg",
    noKeyboard: true,
    onDrop,
  });

  const getArtists = async () => {
    let artists = [];
    const snapshot = await db.collection("Artists").get();
    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      artists = [...artists, { key: id, value: id, text: data.name }];
    });

    setArtists(artists);
  };

  const validateForm = () => {
    if (formState.name.trim().length === 0) {
      toast.warning("Por favor, ingresa el nombre del album");
      return false;
    }
    if (!formState.artist) {
      toast.warning("Por favor, ingresa el artista");
      return false;
    }
    if (!file) {
      toast.warning("Por favor, ingresa la imagen del album");
      return false;
    }
    return true;
  };

  const uploadImage = async (fileName) => {
    const ref = firebase.storage().ref().child(`album/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const fileName = uuidv4();
      try {
        await uploadImage(fileName);
        try {
          await db.collection("Albums").add({
            name: formState.name,
            artist: formState.artist,
            banner: fileName,
          });
          toast.success("Album creado correctamente");
          resetForm();
          setLoading(false);
          setVisible(false);
        } catch (error) {
          toast.error("Error al crear album");
          setLoading(false);
        }
      } catch (error) {
        toast.error("Error al subir la imagen");
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormState(initialValueForm());
    setFile(null);
    setAlbumImage(null);
  };

  useEffect(() => {
    getArtists();
  }, []);

  return (
    <Form className="add-album-form" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Field className="album-avatar">
          <div
            {...getRootProps()}
            className="avatar"
            style={{ backgroundImage: `url(${albumImage})` }}
          />
          <input {...getInputProps()} />
          {!albumImage && <Image src={NoImage} />}
        </Form.Field>
        <Form.Field className="album-inputs" width={11}>
          <Input
            placeholder="Nombre del album"
            onChange={({ target }) =>
              setFormState({ ...formState, name: target.value })
            }
          />
          <Dropdown
            placeholder="El album pertenece..."
            search
            fluid
            selection
            lazyLoad
            options={artists.length !== 0 ? artists : []}
            onChange={(e, data) =>
              setFormState({ ...formState, artist: data.value })
            }
          />
        </Form.Field>
      </Form.Group>
      <Button types="submit" disabled={loading} loading={loading}>
        Crear album
      </Button>
    </Form>
  );
};

function initialValueForm() {
  return {
    name: "",
    artist: "",
  };
}

AddAlbumForm.propTypes = {
  setVisible: PropTypes.func.isRequired,
};

export default AddAlbumForm;
