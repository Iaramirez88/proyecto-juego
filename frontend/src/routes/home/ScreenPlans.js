import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import logoKoala from "../../assets/images/logoInicalAnimado.svg";
import ButtonDiv from "../../components/Buttons";
import HeaderHome from "../../components/shared/HeaderHome";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePriceTitle } from "../../hooks/usePriceTitle";
import { useRequestApi } from "../../hooks/useRequesApi";
import { useSetBackGround } from "../../hooks/useSetBackGround";

const ScreenPlans = () => {
  useSetBackGround();
  const { getData } = useLocalStorage("user");
  const history = useHistory();
  const { id } = useParams();
  const apiPlans = useRequestApi("price");
  const apiUser = useRequestApi("user");
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [totalPay, setTotalPay] = useState(0);
  const [alert, setAlert] = useState(false);
  const [loading, setLoader] = useState(true);
  const getPrice = usePriceTitle();

  const [state, setState] = useState({
    idplan: 0,
    password: "",
    message: "",
    error: false,
  });

  const setPayAmount = (id) => {
    let find = -1;
    let i = 0;
    while (find < 0 && i < plans.length) {
      if (parseInt(id) === plans[i].id_plan) {
        find = i;
      }
      i++;
    }
    setTotalPay(plans[find].valor);
  };

  const onChange = (e, type) => {
    const { value } = e.target;
    type === "idplan" && setPayAmount(value);
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

    const { token } = getData();
    let data = {
      password: state.password,
      email: user.correo_usuario,
      idtipotutor: id,
    };
    setLoader(true);
    const response = await apiUser.post("check-user", data, token);
    setLoader(false);

    if (response.code === 401) {
      return setState({
        ...state,
        message: "Contraseña invalida",
        error: true,
      });
    }
    if (response.code === 500) {
      return setState({
        ...state,
        message: "Lo sentimos algo ha salido mal",
        error: true,
      });
    }
    setAlert(true);
    setTimeout(() => {
      return history.push(`/mi-cuenta/registrar-pago/${id}/${state.idplan}`);
    }, 3000);
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const { id, token } = getData();
      const resUser = await apiUser.get(`${id}`, token);
      if (resUser.code === 404) return;
      const id_tipo_tutor = resUser.response.id_tipo_tutor;
      const resPlan = await apiPlans.get(`1/${id_tipo_tutor}`);
      if (resPlan.code === 404) return;
      const { response } = resPlan;
      let data = response
        .map((item) => {
          return {
            id_plan: item.id_plan,
            title: getPrice(item.meses_precio),
            valor: item.valor,
            meses_precio: item.meses_precio,
            isFree: item.meses_precio === 0 ? true : false,
          };
        })
        .sort((a, b) => {
          if (a.meses_precio > b.meses_precio) {
            return 1;
          }
          if (a.meses_precio < b.meses_precio) {
            return -1;
          }
          return 0;
        });
      if (isMounted) {
        setUser(resUser.response);
        setState({ ...state, idplan: data[0].id_plan });
        setPlans(data);
        setLoader(false);
      }
    };
    init();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <div>
      <HeaderHome />

      <div className="rowFlex planContainer" style={{ position: "relative" }}>
        <div className="leftKoalaLogo">
          <img alt="koala-logo" src={logoKoala} />
        </div>
        <div className="planForm">
          <div className="smForm planInput">
            <label htmlFor="user">Plan {user && user.texto_tutor}</label>

            <select name="plan" onChange={(e) => onChange(e, "idplan")}>
              {plans &&
                plans.map(({ title, id_plan, valor }) => (
                  <option
                    key={id_plan}
                    defaultChecked={valor === 0 ? true : false}
                    value={id_plan}
                  >
                    {title}
                  </option>
                ))}
            </select>
          </div>
          <div className="smForm planInput">
            <label htmlFor="password">Contraseña</label>
            <input
              name="password"
              type="password"
              onChange={(e) => onChange(e, "password")}
              className={state.error ? "errorInput" : ""}
            />
          </div>
          <div className="smForm planInput">
            <label style={{ color: "#006cb3" }} htmlFor="payment">
              Total a pagar: {totalPay} $
            </label>
          </div>

          <div className="smForm planInput">
            {!alert && (
              <span>
                El plan gratis solo te permite jugar con algunas actividades de
                la unidad de Vocales y solo para un estudiante, sin guardar su
                progreso. Para aprovechar al máximo esta plataforma te
                recomendamos cambiarte a un plan premiun.
              </span>
            )}
            {alert && (
              <span style={{ color: "#52c211", fontSize: "1.5em" }}>
                Verificación exitosa.
              </span>
            )}
          </div>
          {state.error && (
            <p className="errorText">
              {/* El correo electronico o la contraseña que ingresaste es incorrecta */}
              {state.message}
            </p>
          )}

          {!alert && (
            <ButtonDiv
              title="CAMBIAR PLAN"
              handler={onSubmit}
              classStyle="smButton smButtonSesion planButton"
            />
          )}
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
