import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import HeaderHome from "../../components/shared/HeaderHome";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import { Link } from "react-router-dom";
import { useRequestApi } from "../../hooks/useRequesApi";
import { useLoading } from "../../hooks/useLoading";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import logokoala from "../../assets/images/logoInicalAnimado.svg";
import TitleInfo from "./TitleInfo";

const ScreenUser = () => {
  useSetBackGround();
  const { id } = useParams();
  const api = useRequestApi("user");
  const setLoader = useLoading();
  const { getData } = useLocalStorage("user");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { token } = getData() || {};
      if (token) {
        setLoader(true);
        const request = await api.get(`${id}`, token);
        setLoader(false);
        if (request.code === 404) return setError(true);
        setUser(request.response);
      }
    };

    init();
  }, []);

  return (
    <div>
      <HeaderHome />
      <div>
        <TitleInfo title="Información de cuenta" />
        {error && (
          <div style={{ textAlign: "center", marginTop: "3em" }}>
            <img alt="logoKoala" src={logokoala} width="100px" height="auto" />
            <div>Lo sentimos, algo ha salido mal</div>
          </div>
        )}

        {user && (
          <div style={{ padding: "0 80px", marginTop: "1.5em" }}>
            <div className="suRowInfoPay suBoxRow">
              <div>
                <div className="suTitleInfo">CUENTA Y FACTURACIÓN</div>
                <div className="suBtnPay">
                  <Link to={`/planes/${user.id_cuenta}`}>
                    Cambiar plan - Pagar
                  </Link>
                </div>
              </div>
              <div style={{ width: "60%" }}>
                <div className="rowFlex">
                  <p>{user.correo_usuario}</p>
                  <p>Cambiar correo</p>
                </div>
                <div className="rowFlex">
                  <p>Contraseña: ******</p>
                  <p>Cambiar Contraseña</p>
                </div>
                <div className="rowFlex">
                  <p>Tu proxima fecha de facturacion dia-mes-año</p>
                  <a>[Dia-Mes-Año]</a>
                </div>
              </div>
            </div>
            <hr></hr>

            <div className="rowFlex suBoxRow">
              <div className="suTitleInfo">INFORMACIÓN DEL PLAN</div>
              <div className="rowFlex" style={{ width: "60%" }}>
                <p>Gratis</p>
                <Link to={`/planes/${user.id_cuenta}`}>Cambiar Plan</Link>
              </div>
            </div>
            <hr></hr>

            <div className="suBoxRow">
              <div className="suTitleInfo">INFORMACIÓN DE FACTURACION</div>
              <div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenUser;
