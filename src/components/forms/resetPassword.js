import React, { useState } from "react";
import ButtonDiv from "../Buttons";

const ResetPassword = ({ onSubmit, titleButton }) => {
  const [state, setState] = useState({
    pass: "",
    checkPass: "",
    error: false,
    message: "",
  });

  const onChange = (type, e) => {
    const { value } = e.target;
    setState({ ...state, [type]: value, error: false });
  };

  const handlerSubmit = () => {
    if (!state.pass && !state.checkPass) {
      setState({
        ...state,
        error: true,
        message: "Las contraseñas son requeridas",
      });
      return;
    }
    if (state.pass !== state.checkPass) {
      setState({
        ...state,
        error: true,
        message: "Las contraseñas deben coincidir",
      });
      return;
    }
    onSubmit(state);
  };

  return (
    <div className="smFormContainer">
      <div className="smForm">
        <label htmlFor="user">Contraseña</label>
        <input
          name="password"
          type="password"
          className={state.error ? "errorInput" : ""}
          onChange={(e) => onChange("pass", e)}
        />
      </div>
      <div className="smForm">
        <label htmlFor="password">Confirmar contraseña</label>
        <input
          name="checkPass"
          type="password"
          onChange={(e) => onChange("checkPass", e)}
          className={state.error ? "errorInput" : ""}
        />
      </div>
      {state.error && <p className="errorText">{state.message}</p>}

      <div
        className="smContainerButton smBoxButton"
        style={{ position: "relative" }}
      >
        <ButtonDiv
          title={titleButton ? "CREAR CUENTA" : "CONFIRMAR CONTRASEÑA"}
          handler={handlerSubmit}
          classStyle="smButton smButtonSesion"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
