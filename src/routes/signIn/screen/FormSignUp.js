import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import btnNext from "../../../assets/images/botonNext.svg";
import ButtonDiv from "../../../components/Buttons";
import ResetPassword from "../../../components/forms/resetPassword";
import { GameContext } from "../../../context/GameContext";
import { useRequestApi } from "../../../hooks/useRequesApi";
import { useLoading } from "../../../hooks/useLoading";
import { validateEmail } from "../../../utils/tools";

const FormSignUp = () => {
  const { id } = useParams();
  const history = useHistory();
  const apiSign = useRequestApi("user");
  const textTutor = "Padre";
  const { dispatch } = useContext(GameContext);
  const setLoader = useLoading();

  const [state, setState] = useState({
    name: "",
    email: "",
    error: false,
    step: 0,
    message: "",
    success: false,
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
    setLoader(true);
    let data = {
      username: state.name,
      password: pass,
      idtipotutor: id,
      email: state.email,
      idplan: 1,
    };

    const { code } = await apiSign.post("", data);
    setLoader(false);

    if (code === 500) {
      return setState({
        ...state,
        message: "Lo sentimos algo malo ha ocurrido",
        error: true,
      });
    }
    if (code === 201) {
      // User created successfully
      setState({ ...state, step: 2 });
    }
  };

  const onBackForm = () => {
    setState({ ...state, step: 0 });
  };

  return (
    <div>
      {state.step === 0 && (
        <div className="smFormContainer">
          <div className="smForm">
            <label htmlFor="user">Tutor {textTutor}</label>
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
          {state.error && (
            <p className="errorText">
              {/* El correo electronico o la contraseña que ingresaste es incorrecta */}
              {state.message}
            </p>
          )}
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
