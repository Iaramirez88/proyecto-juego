import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import btnNext from "../../../assets/images/botonNext.svg";
import ButtonDiv from "../../../components/Buttons";
import ResetPassword from "../../../components/forms/resetPassword";
import { validateEmail } from "../../../utils/tools";

const FormSignUp = () => {
  const { id } = useParams();
  const history = useHistory();

  const [state, setState] = useState({
    name: "",
    email: "",
    error: false,
    step: 0,
    message: "",
  });

  const onChange = (type, e) => {
    const { value } = e.target;
    setState({ ...state, [type]: value, error: false });
  };

  const handlerUser = () => {
    if (!state.name && !state.email) {
      return setState({
        ...state,
        error: true,
        message: "Los campos son requeridos",
      });
    }
    if (!validateEmail(state.email)) {
      return setState({
        ...state,
        error: true,
        message: "Correo invalido",
      });
    }
    setState({
      ...state,
      step: 1,
    });
  };

  const handlerPassword = async ({ pass }) => {
    setState({ ...state, step: 2 });
    let data = {
      username: state.username,
      password: state.password,
      idtipotutor: id,
      email: state.email,
      idplan: 1,
    };
    const request = await fetch("", {
      method: "POST",
      headers: {
        "Content-type": "application/json;",
      },
      body: JSON.stringify(data),
    });

    const response = request.json();
    console.log(response);
  };

  const onBackForm = () => {
    setState({ ...state, step: 0 });
  };

  return (
    <div>
      {state.step === 0 && (
        <div className="smFormContainer">
          <div className="smForm">
            <label htmlFor="user">Tutor</label>
            <input
              name="user"
              type="text"
              onChange={(e) => onChange("name", e)}
              className={state.error ? "errorInput" : ""}
            />
          </div>
          <div className="smForm">
            <label htmlFor="password">Correo electrónico</label>
            <input
              name="email"
              type="email"
              onChange={(e) => onChange("email", e)}
              className={state.error ? "errorInput" : ""}
            />
          </div>
          {state.error && <p className="errorText">{state.message}</p>}
          <div style={{ position: "relative", width: "80%" }}>
            <img
              onClick={() => handlerUser()}
              alt="btn-next"
              src={btnNext}
              className="smBtnNext"
            />
          </div>
        </div>
      )}
      {state.step === 1 && (
        <div>
          <ResetPassword onSubmit={handlerPassword} />
          <ButtonDiv
            title="REGRESAR"
            handler={() => onBackForm()}
            classStyle="smButton smBoxButton smBack"
          />
        </div>
      )}
      {state.step === 2 && (
        <div className="snNotification">
          Revisa el correo para confirmar y finalizar el proceso de registro
        </div>
      )}
      <p style={{ width: "70%", margin: "3em auto 0", fontSize: "1.5em" }}>
        Al registrarte en ARTWORKOALA PLAY aceptas nuestros Términos y Politica
        de Privacidad
      </p>
    </div>
  );
};

// {/*  */}
export default FormSignUp;
