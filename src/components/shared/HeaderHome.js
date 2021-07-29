import React, { useContext } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { GameContext } from "../../context/GameContext";
import { useDimesions } from "../../hooks/useDimesion";
import game from "../../assets/images/juegoMenu.svg";
import user from "../../assets/images/perfilMenu.svg";
import iconBars from "../../assets/images/menuMovil.svg";

const HeaderHome = () => {
  const { stateContext } = useContext(GameContext);
  const screen = useDimesions();
  const history = useHistory();
  const { url } = useRouteMatch();

  return (
    <div>
      <div className={`homeHeader ${stateContext.user ? "userLogged" : ""}`}>
        <span>ARTWORKOALA PLAY</span>

        {stateContext.user && screen.width >= 768 && (
          <div className="homeHeaderIcons">
            <img
              className={url !== "/" ? "active" : ""}
              alt="iconUser"
              src={user}
              width="40px"
              height="auto"
              onClick={() => history.push(`mi-cuenta/${stateContext.user.id}`)}
              style={{ cursor: "pointer" }}
            />
            <img
              className={url === "/" ? "active" : ""}
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
              Registrase
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
