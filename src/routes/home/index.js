import React, { useContext, useEffect } from "react";
import iconBars from "../../assets/images/menuMovil.svg";
import game from "../../assets/images/juegoMenu.svg";
import user from "../../assets/images/perfilMenu.svg";
import { GameContext } from "../../context/GameContext";
import {
  caraOso,
  // caraDino,
  // caraHipo,
  // caraKoala,
  // caraPato,
  // caravaca,
} from "../../utils/imagesResources";
import "../../assets/styles/home.css";
import { useDimesions } from "../../hooks/useDimesion";
import HomeGridComponent from "./ home";
import {
  // vocalAU,
  // letterM,
  // letterNR,
  // letterBf,
  // letterLL,
  // letterJCH,
  vocalAUList,
} from "./elements";
import { useHistory } from "react-router";

const Home = () => {
  const screen = useDimesions();
  const { stateContext } = useContext(GameContext);
  const history = useHistory();

  useEffect(() => {
    document.documentElement.style.backgroundImage = "none";
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div>
      <div className={`homeHeader ${stateContext.user ? "userLogged" : ""}`}>
        <span>ARTWORKOALA PLAY</span>

        {stateContext.user && screen.width >= 768 && (
          <div className="homeHeaderIcons">
            <img
              className="active"
              alt="iconGame"
              src={game}
              width="40px"
              height="auto"
            />
            <img alt="iconUser" src={user} width="40px" height="auto" />
          </div>
        )}
        {!stateContext.user && screen.width >= 768 && (
          <div className="sesionButton">
            <div onClick={() => history.push("sesion")}>Iniciar Sesión</div>
            <div>Registrase</div>
          </div>
        )}
        {screen.width < 768 && (
          <img alt="barsMenu" src={iconBars} width="40px" height="auto" />
        )}
      </div>
      <div style={{ padding: "3em" }}>
        <h1 className="mainTitle">Abecedario</h1>
        <HomeGridComponent
          mainTitle="Vocales AEIOU"
          mainImage={caraOso}
          list={vocalAUList}
          moduleOpen="1"
        />
        {/* <HomeGridComponent
          mainTitle="Letras MPSLT"
          mainImage={caraPato}
          list={letterM}
        />
        <HomeGridComponent
          mainTitle="Letras NDCR"
          mainImage={caraDino}
          list={letterNR}
          moduleOpen="3"
        />
        <HomeGridComponent
          mainTitle="Letras BVGF"
          mainImage={caravaca}
          list={letterBf}
        />
        <HomeGridComponent
          mainTitle="Letras ÑYHZLL"
          mainImage={caraHipo}
          list={letterLL}
        />
        <HomeGridComponent
          mainTitle="Letras JKQCH"
          mainImage={caraKoala}
          list={letterJCH}
        /> */}
      </div>
    </div>
  );
};
// letterBf
// letterLL
// letterJCH

export default Home;
