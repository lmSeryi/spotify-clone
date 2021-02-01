import React, { useState } from "react";

import { Button, Form, Input, Icon } from "semantic-ui-react";

import { toast } from "react-toastify";

import firebase from "../../utils/firebase";
import "firebase/auth";

import { reauthenticate } from "../../utils/api";
import alertErrors from "./../../utils/alertErrors";

const UserPassword = ({ setVisible, setTitle, setContent }) => {
  const onEdit = () => {
    setVisible(true);
    setTitle("Actualizar contraseña");
    setContent(<ChangePassword setVisible={setVisible} />);
  };

  return (
    <div className="user-password">
      <h3>Password: *******</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
};

const ChangePassword = ({ setVisible }) => {
  const [formState, setFormState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [visibleCurrentPassword, setVisibleCurrentPassword] = useState(false);
  const [visibleNewPassword, setVisibleNewPassword] = useState(false);
  const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);

  const validateForm = () => {
    if (
      formState.currentPassword.trim().length === 0 ||
      formState.newPassword.trim().length === 0 ||
      formState.confirmPassword.trim().length === 0
    ) {
      toast.warning("Los campos no pueden estar vacíos");
      return false;
    }
    if (formState.currentPassword === formState.newPassword) {
      toast.warning("Las contraseñas no pueden ser iguales");
      return false;
    }
    if (formState.newPassword !== formState.confirmPassword) {
      toast.warning("Las contraseñas no coinciden");
      return false;
    }
    if (formState.newPassword.length < 6) {
      toast.warning("Las contraseñas tienen que tener mínimo 6 carácteres");
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await reauthenticate(formState.currentPassword);
        const currentUser = firebase.auth().currentUser;

        try {
          await currentUser.updatePassword(formState.newPassword);
          toast.success("Contraseña cambiada correctamente");
          setLoading(false);
          setVisible(false);
        } catch (e) {
          alertErrors(e?.code);
          setLoading(false);
        }
      } catch (e) {
        alertErrors(e?.code);
        setLoading(false);
      }
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Contraseña actual"
          type={!visibleCurrentPassword ? "password" : "text"}
          disabled={loading}
          onChange={({ target }) =>
            setFormState({ ...formState, currentPassword: target.value })
          }
          icon={
            <Icon
              onClick={() => setVisibleCurrentPassword(!visibleCurrentPassword)}
              name={!visibleCurrentPassword ? "eye" : "eye slash outline"}
              link
            />
          }
          value={formState.currentPassword}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Nueva contraseña"
          type={!visibleNewPassword ? "password" : "text"}
          disabled={loading}
          onChange={({ target }) =>
            setFormState({ ...formState, newPassword: target.value })
          }
          icon={
            <Icon
              onClick={() => setVisibleNewPassword(!visibleNewPassword)}
              name={!visibleNewPassword ? "eye" : "eye slash outline"}
              link
            />
          }
          value={formState.newPassword}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Repetir nueva contraseña"
          type={!visibleRepeatPassword ? "password" : "text"}
          disabled={loading}
          onChange={({ target }) =>
            setFormState({ ...formState, confirmPassword: target.value })
          }
          icon={
            <Icon
              onClick={() => setVisibleRepeatPassword(!visibleRepeatPassword)}
              name={!visibleRepeatPassword ? "eye" : "eye slash outline"}
              link
            />
          }
          value={formState.confirmPassword}
        />
      </Form.Field>
      <Button type="submit" loading={loading} disabled={loading}>
        Actualizar
      </Button>
    </Form>
  );
};

export default UserPassword;
