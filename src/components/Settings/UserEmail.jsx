import React, { useState } from "react";

import { Button, Form, Input, Icon } from "semantic-ui-react";

import { toast } from "react-toastify";

import firebase from "../../utils/firebase";
import "firebase/auth";

import { reauthenticate } from "../../utils/api";
import alertErrors from "./../../utils/alertErrors";

const UserEmail = ({
  user,
  setVisible,
  setTitle,
  setContent,
  setReloadApp,
}) => {
  const onEdit = () => {
    setVisible(true);
    setTitle("Actualizar Email");
    setContent(
      <ChangeEmail
        email={user.email}
        setVisible={setVisible}
        setReloadApp={setReloadApp}
      />
    );
  };

  return (
    <div className="user-email">
      <h3>Email: {user.email}</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
};

const ChangeEmail = ({ email, setVisible, setReloadApp }) => {
  const [formState, setFormState] = useState({ email, password: "" });
  const [loading, setLoading] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);

  const onSubmit = async () => {
    if (!formState.email) {
      toast.warning("El email no puede estar vacío");
    } else if (formState.email === email) {
      toast.warning("El email tiene que ser diferente");
    } else {
      setLoading(true);
      try {
        await reauthenticate(formState.password);
        const currentUser = firebase.auth().currentUser;

        try {
          await currentUser.updateEmail(formState.email);
          toast.success(
            "Email actualizado correctamente. Verifica tu nuevo correo"
          );
          setLoading(false);
          setReloadApp((state) => !state);
          setVisible(false);
          await currentUser.sendEmailVerification();
          firebase.auth().signOut();
        } catch (e) {
          alertErrors(e?.code);
          setLoading(false);
        }
      } catch (error) {
        alertErrors(error?.code);
        setLoading(false);
      }
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={`${email}`}
          disabled={loading}
          onChange={({ target }) =>
            setFormState({ ...formState, email: target.value })
          }
          type="text"
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Contraseña"
          type={!visiblePassword ? "password" : "text"}
          disabled={loading}
          onChange={({ target }) =>
            setFormState({ ...formState, password: target.value })
          }
          icon={
            <Icon
              onClick={() => setVisiblePassword(!visiblePassword)}
              name={!visiblePassword ? "eye" : "eye slash outline"}
              link
            />
          }
          value={formState.password}
        />
      </Form.Field>
      <Button type="submit" loading={loading} disabled={loading}>
        Actualizar
      </Button>
    </Form>
  );
};

export default UserEmail;
