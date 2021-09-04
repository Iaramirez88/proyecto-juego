import React, { useContext } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { GameContext } from "../../context/GameContext";
import { useDimesions } from "../../hooks/useDimesion";
import game from "../../assets/images/juegoMenu.svg";
import user from "../../assets/images/perfilMenu.svg";
import licencia from "../../assets/images/licenciaSinFondo.svg";
import iconBars from "../../assets/images/menuMovil.svg";

const HeaderHome = () => {
  const { stateContext } = useContext(GameContext);
  const screen = useDimesions();
  const history = useHistory();
  const { url } = useRouteMatch();
  const paths = url.split("/");
  const currentRoute = paths[1] || "";
  const secondRoute = paths[2] || "";

  return (
    <div>
      <div className={`homeHeader ${stateContext.user ? "userLogged" : ""}`}>
        <span>ARTWORKOALA PLAY</span>

        {stateContext.user && screen.width >= 768 && (
          <div className="homeHeaderIcons">
            {/* <img
              className={
                currentRoute === "mi-cuenta" && paths.length <= 3
                  ? "active"
                  : ""
              }
              alt="iconUser"
              src={user}
              width="40px"
              height="auto"
              onClick={() => history.push(`/mi-cuenta/${stateContext.user.id}`)}
              style={{ cursor: "pointer" }}
            />
            <img
              className={
                currentRoute === "mi-cuenta" && secondRoute === "licencias"
                  ? "active"
                  : ""
              }
              alt="iconUser"
              src={licencia}
              width="40px"
              height="auto"
              onClick={() =>
                history.push(`/mi-cuenta/licencias/${stateContext.user.id}`)
              }
              style={{ cursor: "pointer" }}
            /> */}
            <img
              className={currentRoute === "" ? "active" : ""}
              alt="iconGame"
              src={game}
              width="40px"
              height="auto"
              onClick={() => history.push("/")}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
        {!stateContext.user && screen.width >= 768 && (
          <div className="sesionButton">
            <div onClick={() => history.replace({ pathname: "/sesion" })}>
              Iniciar Sesión
            </div>
            <div
              onClick={() => history.replace({ pathname: "sesion/terminos" })}
            >
              Registrarse
            </div>
          </div>
        )}
        {screen.width < 768 && (
          <img alt="barsMenu" src={iconBars} width="40px" height="auto" />
        )}
      </div>
    </div>
  );
};

export default HeaderHome;
