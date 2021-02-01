import React, { useState } from "react";

import { Form, Input, Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import firebase from "../../utils/firebase";
import "firebase/auth";

const UserName = ({ user, setVisible, setContent, setTitle, setReloadApp }) => {
  const onEdit = () => {
    setVisible(true);
    setTitle("Actualizar nombre");
    setContent(
      <ChangeDisplayNameForm
        displayName={user.displayName}
        setVisible={setVisible}
        setReloadApp={setReloadApp}
      />
    );
  };

  return (
    <div className="user-name">
      <h2>{user.displayName}</h2>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
};

const ChangeDisplayNameForm = ({ displayName, setVisible, setReloadApp }) => {
  const [formState, setFormState] = useState({ displayName });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!formState.displayName || formState.displayName === displayName) {
      setVisible(false);
    } else {
      setLoading(true);
      try {
        await firebase
          .auth()
          .currentUser.updateProfile({ displayName: formState.displayName });
        setReloadApp((state) => !state);
        toast.success("Nombre actualizado correctamente");
        setLoading(false);
        setVisible(false);
      } catch (error) {
        toast.error("Error al actualizar el nombre");
        setLoading(false);
      }
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={`${displayName}`}
          disabled={loading}
          onChange={({ target }) => setFormState({ displayName: target.value })}
        />
      </Form.Field>
      <Button type="submit" loading={loading} disabled={loading}>
        Actualizar
      </Button>
    </Form>
  );
};

export default UserName;
