import React, { useEffect } from "react";
import iconBars from "../../assets/images/menuMovil.svg";
import game from "../../assets/images/juegoMenu.svg";
import user from "../../assets/images/perfilMenu.svg";
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

const Home = () => {
  const screen = useDimesions();

  useEffect(() => {
    document.documentElement.style.backgroundImage = "none";
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div>
      <div className="homeHeader">
        <span>ARTWORKOALA PLAYAPP</span>
        {screen.width >= 768 && (
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
