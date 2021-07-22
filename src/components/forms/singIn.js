import React, { useContext, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router";
import ButtonDiv from "../Buttons";
import { validateEmail } from "../../utils/tools";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { GameContext } from "../../context/GameContext";

const SingIn = () => {
  const history = useHistory();
  let { url } = useRouteMatch();
  const { setData } = useLocalStorage("user");
  const { dispatch } = useContext(GameContext);

  const [state, setState] = useState({
    email: "",
    password: "",
    error: false,
    message: "",
  });

  const onChange = (type, e) => {
    const { value } = e.target;

    setState({ ...state, [type]: value, error: false, message: "" });
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

    const response = await fetch("http://localhost:8989/api/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        username: state.email,
        password: state.password,
      }),
    });
    let data = await response.json();

    if (data.code !== 200)
      return setState({
        ...state,
        error: true,
        message: "Oops! algo ha salido mal",
      });
    if (data.code === 200) {
      dispatch({
        type: "SET_USER",
        data: data.response,
      });
      setData(data.response);
      return history.push("/");
    }
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
      </div>
      <ButtonDiv
        title="¿Has olvidado tu contraseña?"
        handler={() => history.push("recuperar-contrasena")}
        classStyle="smRecoverPass"
      />
      <div className="smBoxButton">
        <hr></hr>
        <ButtonDiv
          title="CREAR CUENTA NUEVA"
          handler={() => history.push(`registro`)}
          classStyle="smButton smNewAccount"
        />
      </div>
    </div>
  );
};

export default SingIn;
