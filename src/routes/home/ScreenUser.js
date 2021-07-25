import React from "react";
import HeaderHome from "../../components/shared/HeaderHome";
import { useSetBackGround } from "../../hooks/useSetBackGround";

const ScreenUser = () => {
  useSetBackGround();

  return (
    <div>
      <HeaderHome />
      <div>
        <div className="suBoxHeader">
          <div className="suTitleCuenta">Información de cuenta</div>
          <div className="suInfoIcon">?</div>
        </div>

        <div style={{ padding: "0 80px", marginTop: "1.5em" }}>
          <div className="suRowInfoPay suBoxRow">
            <div>
              <div className="suTitleInfo">CUENTA Y FACTURACIÓN</div>
              <div className="suBtnPay">Cambiar plan - Pagar</div>
            </div>
            <div style={{ width: "60%" }}>
              <div className="rowFlex">
                <p>ideas@usuario.com</p>
                <a>Cambiar Plan</a>
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
      </div>
    </div>
  );
};

export default ScreenUser;
