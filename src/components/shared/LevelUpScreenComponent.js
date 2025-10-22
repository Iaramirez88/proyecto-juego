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

const ComponentPortrait = ({ gameUrl }) => {
  const [container, setContainer] = useState(initialHeight());
  const [isLandscape, setIsLandscape] = useState(getOrientation());
  const [sound, setAudio] = useState(null);
  const history = useHistory();

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
    const orientationChange = () => {
      setIsLandscape(getOrientation());
    };
    let items = [resBien, RestExcelente, RestFelicitaciones, ResvMuybien];
    const aud = items[Math.floor(Math.random() * items.length)];
    setAudio(aud);
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
          <button 
            onClick={handleContinue} 
            className="button-continue"
          >
            Continuar
          </button>
          <button 
            onClick={handleMenu} 
            className="button-volver"
          >
            Volver al menú
          </button>
          <button 
            onClick={handleRepeat} 
            className="button-repetir"
          >
            Repetir juego
          </button>
        </div>
        </div>
        
        
      </div>
      {sound && <audio src={sound} autoPlay />}
    </div>
  );
};

const LevelUpScreenComponent = ({ gameUrl }) => {
  return (
    <div>
  <ComponentPortrait gameUrl={gameUrl} />
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
