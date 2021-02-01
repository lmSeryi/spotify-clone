import React, { useState } from "react";

import firebase from "../../../utils/firebase";
import "firebase/auth";

import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";

import { validateEmail } from "../../../utils/Validations";

import "./LoginForm.scss";

const LoginForm = ({ setSelectedForm }) => {
  const [formState, setFormState] = useState(defaultValueForm());
  const [formError, setFormError] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [user, setUser] = useState(null);

  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

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

    setFormError(error);
    if (!formOk) return false;
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(
          formState.email.toLowerCase(),
          formState.password
        );

      setUserActive(user.emailVerified);
      setLoading(false);
      setUser(user);

      if (!user.emailVerified) {
        toast.warning(
          "Se requiere confirmar el correo electrónico para poder ingresar"
        );
      }
    } catch (e) {
      handleError(e.code);
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h1>Música para todos</h1>
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
            disabled={loading}
            icon={
              <Icon
                name={passwordVisible ? "eye slash outline" : "eye"}
                link
                onClick={handleShowPassword}
              />
            }
            onChange={onChange}
            value={formState.password}
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">La contraseña no es válida</span>
          )}
        </Form.Field>
        <Button type="submit" disabled={loading} loading={loading}>
          Iniciar Sesión
        </Button>
      </Form>
      {!userActive && (
        <ButtonResendEmailVerification
          user={user}
          setLoading={setLoading}
          setUserActive={setUserActive}
        />
      )}
      <div className="login-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          ¿No tienes cuenta?{" "}
          <span onClick={() => setSelectedForm("register")}>Regístrate</span>
        </p>
      </div>
    </div>
  );
};

function ButtonResendEmailVerification(props) {
  const { user, setLoading, setUserActive } = props;

  const resendVerification = async () => {
    try {
      await user.sendEmailVerification();
      toast.success("Se ha enviado el correo de verificación");
    } catch (e) {
      handleError(e.code);
    } finally {
      setLoading(false);
      setUserActive(true);
    }
  };

  return (
    <div className="resend-verification-email">
      <p>
        Si no has recibido el email de verificación puedes volver a enviarlo
        haciendo click <span onClick={resendVerification}>aquí</span>
      </p>
    </div>
  );
}

const handleError = (code) => {
  switch (code) {
    case "auth/wrong-password":
      toast.warning("La contraseña son incorrectos");
      return;
    case "auth/too-many-requests":
      toast.warning(
        "Has enviado demasiadas solicitudes de confirmación en poco tiempo"
      );
      return;
    case "auth/user-not-found":
      toast.warning("Email no registrado");
      return;
    default:
      break;
  }
};

function defaultValueForm() {
  return {
    email: "",
    password: "",
  };
}

export default LoginForm;
