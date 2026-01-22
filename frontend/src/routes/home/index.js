import React, { useEffect, useState } from "react";
import {
  caraOso,
  //caraDino,
  // caraHipo,
  // caraKoala,
  caraPato,
  // caravaca,
} from "../../utils/imagesResources";
import "../../assets/styles/home.css";
import HomeGridComponent from "./ home";
import {
  // vocalAU,
  // letterNR,
  // letterBf,
  // letterLL,
  // letterJCH,
  getLetterM,
  getVocalAUList,
} from "./elements";
import HeaderHome from "../../components/shared/HeaderHome";
import { useSetScrollPosition } from "../../hooks/useDimesion";

const Home = () => {
  useSetScrollPosition();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.documentElement.style.backgroundImage = "none";
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "white";
    
    // 🎯 Escuchar cambios de configuración del admin
    const handleConfigChange = () => {
      console.log('🏠 Home: Configuración cambió, refrescando...');
      setRefreshKey(prev => prev + 1); // Forzar re-render
    };
    
    // Escuchar eventos de cambio de configuración
    window.addEventListener('adminConfigChanged', handleConfigChange);
    window.addEventListener('forceConfigReload', handleConfigChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('adminConfigChanged', handleConfigChange);
      window.removeEventListener('forceConfigReload', handleConfigChange);
    };
  }, []);
  return (
    <div key={refreshKey}>
      <HeaderHome />
      <div style={{ padding: "0 3em" }}>
        <h1 className="mainTitle">Abecedario</h1>
        <HomeGridComponent
          mainTitle="Vocales AEIOU"
          mainImage={caraOso}
          list={getVocalAUList()}
          moduleOpen="1"
        />
        <HomeGridComponent
          mainTitle="Letras MPSTL"
          mainImage={caraPato}
          list={getLetterM()}
          moduleOpen="2"
        />
      </div>
    </div>
  );
};

export default Home;
