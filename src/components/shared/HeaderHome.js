import React, { useContext } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { GameContext } from "../../context/GameContext";
import { useDimesions } from "../../hooks/useDimesion";
import game from "../../assets/images/juegoMenu.svg";
import user from "../../assets/images/perfilMenu.svg";
import licencia from "../../assets/images/licenciaSinFondo.svg";

const HeaderHome = () => {
  const { stateContext } = useContext(GameContext);
  const screen = useDimesions();
  const history = useHistory();
  const { url } = useRouteMatch();
  const paths = url.split("/");
  const currentRoute = paths[1] || "";
  const secondRoute = paths[2] || "";

  const [showMenu, setShowMenu] = React.useState(false);

  // Estado para animar el icono de menú (barras/X)
  const [menuIconActive, setMenuIconActive] = React.useState(false);

  // Maneja el click en el icono de menú móvil
  const handleMenuIconClick = () => {
    setShowMenu((prev) => !prev);
    setMenuIconActive((prev) => !prev);
  };

  return (
    <div>
      <div className={`homeHeader ${stateContext.user ? "userLogged" : ""}`}>
        <span>ARTWORKOALA PLAY</span>

        {stateContext.user && screen.width >= 768 && (
          <div className="homeHeaderIcons">
            <img
              className={
                (currentRoute === "mi-cuenta" && paths.length <= 3) ||
                secondRoute === "planes" ||
                secondRoute === "registrar-pago"
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
            />
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
          <div className="menuIconContainer">
            {/* Icono animado de menú/hamburguesa/X */}
            <div
              onClick={handleMenuIconClick}
              className="menuIcon"
            >
              <div
                className={`menu-icon${menuIconActive ? " active" : ""}`}
              >
                <span className="menu-icon-line"
                  style={{
                    transform: menuIconActive
                      ? "rotate(45deg) translateY(6px)"
                      : "none",
                  }}
                />
                <span className="menu-icon-line-middle"
                  style={{
                    opacity: menuIconActive ? 0 : 1,
                  }}
                />
                <span className="menu-icon-line-bottom"
                  style={{
                    transform: menuIconActive
                      ? "rotate(-45deg) translateY(-6px)"
                      : "none",
                  }}
                />
              </div>
            </div>
            {!stateContext.user && showMenu && (
              <div className="menuDropdown"
              >
                <div
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee"
                  }}
                  onClick={() => {
                    setShowMenu(false);
                    setMenuIconActive(false);
                    history.replace({ pathname: "/sesion" });
                  }}
                >
                  Iniciar Sesión
                </div>
                <div
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setShowMenu(false);
                    setMenuIconActive(false);
                    history.replace({ pathname: "sesion/terminos" });
                  }}
                >
                  Registrarse
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default HeaderHome;
