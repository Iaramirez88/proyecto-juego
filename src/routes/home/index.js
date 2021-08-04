import React, { useEffect } from "react";
import {
  caraOso,
  // caraDino,
  // caraHipo,
  // caraKoala,
  // caraPato,
  // caravaca,
} from "../../utils/imagesResources";
import "../../assets/styles/home.css";
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
import HeaderHome from "../../components/shared/HeaderHome";

const Home = () => {
  useEffect(() => {
    document.documentElement.style.backgroundImage = "none";
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div>
      <HeaderHome />
      <div style={{ padding: "0 3em" }}>
        <h1 className="mainTitle">Abecedario</h1>
        <HomeGridComponent
          mainTitle="Vocales AEIOU"
          mainImage={caraOso}
          list={vocalAUList}
          moduleOpen="1"
        />
      </div>
    </div>
  );
};

export default Home;
