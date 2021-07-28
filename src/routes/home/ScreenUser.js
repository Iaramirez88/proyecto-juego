import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import HeaderHome from "../../components/shared/HeaderHome";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import { Link } from "react-router-dom";
import { useRequestApi } from "../../hooks/useRequesApi";
import { useLoading } from "../../hooks/useLoading";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import logokoala from "../../assets/images/logoInicalAnimado.svg";

const ScreenUser = () => {
  useSetBackGround();
  const { history } = useHistory();
  const api = useRequestApi("user");
  const setLoader = useLoading();
  const { getData } = useLocalStorage("user");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoader(true);
      const { id, token } = getData();
      const request = await api.get(`/${id}`, token);
      setLoader(false);
      if (request.code === 404) return setError(true);
      setUser(request.response);
    };

    init();
  }, []);

  return (
    <div>
      <HeaderHome />
      <div>
        <div className="suBoxHeader">
          <div className="suTitleCuenta">Información de cuenta</div>
          <a
            href="https://www.artworkoala.com/preguntas-frecuentas/"
            target="_blank"
            className="suInfoIcon"
            rel="noreferrer"
          >
            ?
          </a>
        </div>
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
                  <Link to="planes">Cambiar plan - Pagar</Link>
                </div>
              </div>
              <div style={{ width: "60%" }}>
                <div className="rowFlex">
                  <p>{user.correo_usuario}</p>
                  <Link to={`planes/${user.id_cuenta}`}>Cambiar Plan</Link>
                </div>
                <div className="rowFlex">
                  <p>Contraseña: ******</p>
                  <a>Cambiar Contraseña</a>
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
                <a>Cambiar plan - Pagar</a>
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
