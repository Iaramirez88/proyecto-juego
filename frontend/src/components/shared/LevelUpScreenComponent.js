import React, { useEffect, useState } from "react";
import "../../assets/styles/shared-screen.css";
import logoFondoAzul from "../../assets/images/logoFondoAzul.svg";
import gsap from "gsap";
import Header from "./Header";
import { useHistory } from "react-router-dom";
import {
  resBien,
  RestExcelente,
  RestFelicitaciones,
  ResvMuybien,
} from "../../utils/sounds";

const ComponentPortrait = ({ gameUrl, accuracy }) => {
  const [container, setContainer] = useState(initialHeight());
  const [isLandscape, setIsLandscape] = useState(getOrientation());
  const [sound, setAudio] = useState(null);
  const history = useHistory();
  const isPerfectScore = accuracy === 100;

  useEffect(() => {
    const updateScreenHeight = () => {
      let height = window.innerHeight;
      setContainer({
        height1: isLandscape ? height : height / 2,
        height2: height,
      });
    };
    window.addEventListener("resize", updateScreenHeight);

    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, [isLandscape]);

  useEffect(() => {
    // Seleccionar audio aleatorio al montar el componente
    let items = [resBien, RestExcelente, RestFelicitaciones, ResvMuybien];
    const aud = items[Math.floor(Math.random() * items.length)];
    setAudio(aud);
  }, []);

  useEffect(() => {
    const orientationChange = () => {
      setIsLandscape(getOrientation());
    };
    window.addEventListener("orientationchange", orientationChange);
    return () => {
      window.removeEventListener("orientationchange", orientationChange);
    };
  }, []);
  // Handlers para los botones
  // Orden de juegos (sin 'Armar')
  const gameOrder = [
    { name: 'vocabulario', path: '/vocabulario/' },
    { name: 'escucha', path: '/escucha/' },
    { name: 'pares', path: '/pares/' },
    { name: 'otoño', path: '/otoño/' },
    { name: 'escritura', path: '/escritura/' }
  ];

  // Detectar juego y letra actual desde gameUrl
  const getNextGameUrl = () => {
    if (!gameUrl) return '/';
    // Extraer juego y letra
    // const match = gameUrl.match(/\/(\w+)[^/]*\/(\w+)/);
    const match = gameUrl.match(/\/([\wñÑáéíóúÁÉÍÓÚ]+)[^/]*\/([\wñÑáéíóúÁÉÍÓÚ]+)/);
    if (!match) return '/';
    const currentGame = match[1];
    const currentLetter = match[2];
    const idx = gameOrder.findIndex(g => g.name === currentGame);
    if (idx === -1 || idx === gameOrder.length - 1) return '/';
    // Siguiente juego
    return gameOrder[idx + 1].path + currentLetter;
  };
  const handleContinue = () => {
    const nextUrl = getNextGameUrl();
    history.push(nextUrl);
  };
  const handleMenu = () => {
    // Redirige al menú principal
    history.push("/");
  };
  const handleRepeat = () => {
    // Si existe la prop gameUrl, redirige a esa ruta; si no, recarga la página
    if (typeof gameUrl === 'string' && gameUrl.length > 0) {
      history.push(gameUrl);
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    const containerElement = document.querySelector(".container-second");
    const logoElement = document.querySelector(".logo");
    
    if (containerElement || logoElement) {
      var tl = gsap.timeline();

      if (containerElement) {
        tl.from(".container-second", {
          y: container.height2,
          duration: 1,
          opacity: 0,
        });
      }
      if (logoElement) {
        tl.from(".logo", { duration: 1, opacity: 0, scale: 0.5 });
      }
    }
  }, [container]);

  return (
    <div>
      <Header onGoBack={() => history.push("/")}></Header>
      <div className={` container-sup `}>
        <div
          className="container-second"
          style={{ 
            height: `${container.height2}px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          {/* Sección superior: Logo y texto */}
          <div className="logo-text-container">
            <img className="logo" src={logoFondoAzul} alt="logoKoala" />
            <div className="text-box" style={{ minWidth: 'auto' }}>
              <p>¡Felicitaciones!</p>
              <p>Lo has logrado</p>
            </div>
          </div>
          <div className="button-container" >
          {isPerfectScore && (
            <button 
              onClick={handleContinue} 
              className="button-continue icon-button"
              title="Continuar al siguiente nivel"
            >
              <span className="button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </span>
              <span className="button-text">Continuar</span>
            </button>
          )}
          <button 
            onClick={handleMenu} 
            className="button-volver icon-button"
            title="Volver al menú principal"
          >
            <span className="button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </span>
            <span className="button-text">Volver al menú</span>
          </button>
          <button 
            onClick={handleRepeat} 
            className="button-repetir icon-button"
            title="Repetir este juego"
          >
            <span className="button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
            </span>
            <span className="button-text">Repetir juego</span>
          </button>
        </div>
        </div>
        
        
      </div>
      {sound && <audio src={sound} autoPlay />}
    </div>
  );
};

const LevelUpScreenComponent = ({ gameUrl, accuracy }) => {
  return (
    <div>
  <ComponentPortrait gameUrl={gameUrl} accuracy={accuracy} />
    </div>
  );
};

function initialHeight() {
  let height = window.innerHeight;
  let isLandscape = getOrientation();
  return {
    height1: isLandscape ? height : height / 2,
    height2: height,
  };
}

function getOrientation() {
  var orientation =
    (window.screen.orientation || {}).type ||
    window.screen.mozOrientation ||
    window.screen.msOrientation;

  if (orientation === "landscape-primary") {
    return true;
  }
  if (orientation === "landscape-secondary") {
    return true;
  }
  if (orientation.angle > 60) {
    return true;
  }

  return false;
}

export default LevelUpScreenComponent;
