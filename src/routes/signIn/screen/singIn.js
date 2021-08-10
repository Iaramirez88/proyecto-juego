/**
 * Screen and form used to sign in a user.
 * @module SingIn*/

import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import ButtonDiv from "../../../components/Buttons";
import { GameContext } from "../../../context/GameContext";
import useAuth from "../../../hooks/useAuth";
import { validateEmail } from "../../../utils/tools";

/**
 * @function
 * @property {object} state Current state of app
 * @property {string} state.email
 * @property {string} state.password
 * @property {boolean} state.error
 * @property {string} state.message
 */
const SingIn = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    error: false,
    message: "",
  });
  const history = useHistory();
  const { dispatch } = useContext(GameContext);
  const { signIn } = useAuth(dispatch);

  const onChange = (type, e) => {
    const { value } = e.target;
    setState({ ...state, [type]: value, error: false, message: "" });
  };

  const onSuccess = () => history.push("/");

  const onFailed = (code) => {
    console.log(code);
    setState({
      ...state,
      error: true,
      message:
        code === 403 || code === 404
          ? "Correo o contraseña incorrectos"
          : "Oops! algo ha salido mal",
    });
  };

  const onSubmit = async () => {
    if (!state.email)
      return setState({ ...state, message: "Correo requerido", error: true });
    if (!state.password)
      return setState({
        ...state,
        message: "Contraseña requerido",
        error: true,
      });
    if (!validateEmail(state.email))
      return setState({ ...state, message: "Correo invalido", error: true });

    let data = {
      username: state.email,
      password: state.password,
    };

    await signIn(data, onSuccess, onFailed);
  };

  return (
    <div className="smFormContainer">
      <div className="smForm">
        <label htmlFor="user">Correo</label>
        <input
          onChange={(e) => onChange("email", e)}
          name="user"
          type="text"
          className={false ? "errorInput" : ""}
        />
      </div>
      <div className="smForm">
        <label htmlFor="password">Contraseña</label>
        <input
          onChange={(e) => onChange("password", e)}
          name="password"
          type="password"
          className={false ? "errorInput" : ""}
        />
      </div>
      <div className="smBoxButton">
        {state.error && (
          <p className="errorText">
            {/* El correo electronico o la contraseña que ingresaste es incorrecta */}
            {state.message}
          </p>
        )}
        <ButtonDiv
          title="INICIAR SESIÓN"
          handler={onSubmit}
          classStyle="smButton smButtonSesion"
        />
        <ButtonDiv
          title="¿Has olvidado tu contraseña?"
          handler={() => history.push("recuperar-contrasena")}
          classStyle="smRecoverPass"
        />
      </div>
      <div className="smBoxButton">
        <hr></hr>
        <ButtonDiv
          title="CREAR CUENTA NUEVA"
          handler={() => history.push("terminos")}
          classStyle="smButton smNewAccount"
        />
      </div>
    </div>
  );
};

export default SingIn;
