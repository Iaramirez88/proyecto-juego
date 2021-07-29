import React, { useContext, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router";
import ButtonDiv from "../Buttons";
import { validateEmail } from "../../utils/tools";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { GameContext } from "../../context/GameContext";
import { useRequestApi } from "../../hooks/useRequesApi";
import { useLoading } from "../../hooks/useLoading";

const SingIn = () => {
  const history = useHistory();
  let { url } = useRouteMatch();
  const { setData } = useLocalStorage("user");
  const apiUser = useRequestApi("auth");
  const { dispatch } = useContext(GameContext);
  const setLoader = useLoading();

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

    let data = {
      username: state.email,
      password: state.password,
    };
    setLoader(true);
    const response = await apiUser.post("login", data);
    setLoader(false);
    if (response.code === 404)
      return setState({
        ...state,
        error: true,
        message: "Correo o contraseña incorrectos",
      });
    if (response.code !== 200)
      return setState({
        ...state,
        error: true,
        message: "Oops! algo ha salido mal",
      });
    if (response.code === 200) {
      dispatch({
        type: "SET_USER",
        data: response.response,
      });
      setData(response.response);
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
          handler={() => history.push("terminos")}
          classStyle="smButton smNewAccount"
        />
      </div>
    </div>
  );
};

export default SingIn;
