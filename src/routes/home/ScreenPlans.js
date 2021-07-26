import React, { useState } from "react";
import { useHistory } from "react-router";
import logoKoala from "../../assets/images/logoInicalAnimado.svg";
import ButtonDiv from "../../components/Buttons";
import HeaderHome from "../../components/shared/HeaderHome";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useSetBackGround } from "../../hooks/useSetBackGround";

const ScreenPlans = () => {
  useSetBackGround();
  const { getData } = useLocalStorage("user");
  const history = useHistory();

  const [state, setState] = useState({
    idplan: 0,
    password: "",
    message: "",
    error: false,
  });

  const onChange = (e, type) => {
    const { value } = e.target;
    setState({ ...state, [type]: value, message: "", error: false });
  };

  const onSubmit = async () => {
    if (!state.password) {
      return setState({
        ...state,
        message: "Contraseña requerida",
        error: true,
      });
    }
    const apiUrl = process.env.REACT_APP_API_URL;
    const auth = getData();
    const response = await fetch(`${apiUrl}/user/plans`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        password: state.password,
      }),
    });
    let data = await response.json();
    if (data.code === 401) {
      return setState({
        ...state,
        message: "Contraseña invalida",
        error: true,
      });
    }
    return history.push("/realizar-pagos");
  };

  return (
    <div>
      <HeaderHome />

      <div className="rowFlex planContainer" style={{ position: "relative" }}>
        <div className="leftKoalaLogo">
          <img alt="koala-logo" src={logoKoala} />
        </div>
        <div className="planForm">
          <div className="smForm planInput">
            <label htmlFor="user">Plan</label>

            <select name="plan" onChange={(e) => onChange(e, "idplan")}>
              <option value="1" defaultChecked>
                Gratis
              </option>
              <option value="2">Mensual</option>
              <option value="3">Trimestral - 3 meses</option>
              <option value="4">Semestral - 6 meses</option>
            </select>
          </div>
          <div className="smForm planInput">
            <label htmlFor="user">Contraseña</label>
            <input
              name="password"
              type="password"
              onChange={(e) => onChange(e, "password")}
              className={state.error ? "errorInput" : ""}
            />
          </div>

          <div className="smForm planInput">
            <span>
              El plan gratis solo te permite jugar con algunas actividades de la
              unidad de Vocales y solo para un estudiante, sin guardar su
              progreso. Para aprovechar al máximo esta plataforma te
              recomendamos cambiarte a un plan premiun.
            </span>
          </div>
          {state.error && (
            <p className="errorText">
              {/* El correo electronico o la contraseña que ingresaste es incorrecta */}
              {state.message}
            </p>
          )}
          <ButtonDiv
            title="CAMBIAR PLAN"
            handler={onSubmit}
            classStyle="smButton smButtonSesion planButton"
          />
        </div>
        <div
          className="suBoxHeader"
          style={{ position: "absolute", right: "0", top: "0" }}
        >
          <a
            href="https://www.artworkoala.com/preguntas-frecuentas/"
            target="_blank"
            className="suInfoIcon"
            rel="noreferrer"
          >
            ?
          </a>
        </div>
      </div>
    </div>
  );
};

export default ScreenPlans;
