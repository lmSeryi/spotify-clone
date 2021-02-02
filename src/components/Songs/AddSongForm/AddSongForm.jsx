import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";

import { v4 as uuidv4 } from "uuid";

import firebase from "../../../utils/firebase";
import "firebase/firestore";
import "firebase/storage";

import "./AddSongForm.scss";
import { toast } from "react-toastify";

const db = firebase.firestore(firebase);

const AddSongForm = ({ setVisible }) => {
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(initialValueForm());

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const validateForm = () => {
    if (formState.name.trim().length === 0) {
      toast.warning("Por favor, ingrese el nombre de la canción.");
      return false;
    }
    if (!formState.album) {
      toast.warning("Por favor, ingrese el album de la canción.");
      return false;
    }
    if (!file) {
      toast.warning("Por favor, agrege el archivo de la canción.");
      return false;
    }
    return true;
  };

  const uploadSong = async (fileName) => {
    const ref = firebase.storage().ref().child(`song/${fileName}`);
    return ref.put(file);
  };

  const resetState = () => {
    setFormState(initialValueForm());
    setFile(null);
  };

  const onSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const fileName = uuidv4();
      try {
        await uploadSong(fileName);
        try {
          db.collection("Songs").add({
            name: formState.name,
            album: formState.album,
            fileName,
          });
          toast.success("Canción agregada correctamente");
          resetState();
          setLoading(false);
          setVisible(false);
        } catch (error) {
          toast.error("Error al agregar la canción");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Error al subir la canción");
      }
    }
  };

  const getAlbums = async () => {
    let albums = [];
    try {
      const snapshot = await db.collection("Albums").get();
      snapshot.size !== 0 &&
        snapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          albums = [...albums, { key: id, value: id, text: data.name }];
        });
      setAlbums(albums);
    } catch (error) {
      toast.error("Error al cargar los álbumes");
    }
  };

  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Nombre de la canción"
          onChange={({ target }) =>
            setFormState({ ...formState, name: target.value })
          }
          value={formState.name}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          search
          selection
          lazyLoad
          options={albums.length > 0 ? albums : []}
          onChange={(ev, data) =>
            setFormState({ ...formState, album: data.value })
          }
          disabled={loading}
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} disabled={loading} />
          <Icon name="cloud upload" className={file && "load"} />
          <div>
            <p>
              Arrastra tu canción o haz click <span>aquí</span>
            </p>
            {file && (
              <p>
                Canción subida: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit" disabled={loading} loading={loading}>
        Agregar canción
      </Button>
    </Form>
  );
};

function initialValueForm() {
  return {
    name: "",
    album: "",
  };
}

AddSongForm.propTypes = {
  setVisible: PropTypes.func.isRequired,
};

export default AddSongForm;
