import React, { useState } from "react";

import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";

import { validateEmail } from "./../../../utils/Validations";

import firebase from "../../../utils/firebase";
import "firebase/auth";

import "./RegisterForm.scss";

const RegisterForm = ({ setSelectedForm }) => {
  const [formState, setFormState] = useState(defaultValueForm());
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = ({ target }) => {
    const { name, value } = target;
    setFormState({ ...formState, [name]: value });
  };

  const validateForm = () => {
    setFormError({});
    let error = {};
    let formOk = true;

    if (!validateEmail(formState.email)) {
      error.email = true;
      formOk = false;
    }

    if (formState.password.length < 6) {
      error.password = true;
      formOk = false;
    }

    if (formState.username.trim().length === 0) {
      error.username = true;
      formOk = false;
    }

    setFormError(error);
    if (!formOk) return false;
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(
          formState.email.toLowerCase(),
          formState.password
        );
      changeUserName();
      vertificationEmail();
      setFormState(defaultValueForm());
    } catch (e) {
      toast.error("Error al crear la cuenta.");
    } finally {
      setLoading(false);
      setSelectedForm(null);
    }
  };

  const changeUserName = async () => {
    try {
      await firebase
        .auth()
        .currentUser.updateProfile({ displayName: formState.username });
    } catch (e) {
      toast.error("Error al asignar el nombre de usuario.");
    }
  };

  const vertificationEmail = async () => {
    try {
      await firebase.auth().currentUser.sendEmailVerification();
      toast.success("Se ha enviado un mensaje de verificación");
    } catch (e) {
      toast.error("Error al enviar email de verificación");
    }
  };

  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="register-form">
      <h1>Empieza a escuchar con una cuenta de Musicfy gratis.</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Correo electrónico"
            icon="mail outline"
            onChange={onChange}
            disabled={loading}
            value={formState.email}
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">
              Por favor, introduce un correo electrónico válido
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            icon={
              <Icon
                name={passwordVisible ? "eye slash outline" : "eye"}
                link
                onClick={handleShowPassword}
              />
            }
            onChange={onChange}
            disabled={loading}
            value={formState.password}
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">
              La contraseña tiene que tener más de 5 dígitos
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type="text"
            name="username"
            placeholder="Usuario"
            icon="user circle outline"
            onChange={onChange}
            disabled={loading}
            value={formState.username}
            error={formError.username}
          />
          {formError.username && (
            <span className="error-text">
              Introduce cómo quieres que te llamemos
            </span>
          )}
        </Form.Field>
        <Button type="submit" disabled={loading} loading={loading}>
          Continuar
        </Button>
      </Form>
      <div className="register-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          ¿Ya tienes Musicfy?{" "}
          <span onClick={() => setSelectedForm("login")}>Iniciar Sesión</span>
        </p>
      </div>
    </div>
  );
};

function defaultValueForm() {
  return {
    email: "",
    password: "",
    username: "",
  };
}

export default RegisterForm;
