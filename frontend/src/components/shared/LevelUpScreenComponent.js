import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/shared-screen.css";
import logoFondoAzul from "../../assets/images/logoFondoAzul.svg";
import gsap from "gsap";
import Header from "./Header";
import { useHistory } from "react-router-dom";
import { usePlaySounds } from "../../hooks/usePlaySounds";
import { getMinAccuracyToContinueForGame } from "../../config/levelUpContinueRules";
import { getDefaultGameActive, getDefaultGameVisible } from "../../config/adminGameDefaults";

const ComponentPortrait = ({ gameUrl, accuracy, canContinue, minAccuracyToContinue }) => {
  const [container, setContainer] = useState(initialHeight());
  const [isLandscape, setIsLandscape] = useState(getOrientation());
  const history = useHistory();
  const safeAccuracy = typeof accuracy === "number" ? accuracy : 0;

  const gameMatch = typeof gameUrl === "string"
    ? gameUrl.match(/\/([\wñÑáéíóúÁÉÍÓÚ]+)[^/]*\//)
    : null;
  const gameNameFromUrl = gameMatch ? gameMatch[1] : null;

  const minAcc =
    typeof minAccuracyToContinue === "number"
      ? minAccuracyToContinue
      : getMinAccuracyToContinueForGame(gameNameFromUrl);

  const allowContinue =
    typeof canContinue === "boolean" ? canContinue : safeAccuracy >= minAcc;
  const [, , stopSound] = usePlaySounds();
  const didStopRef = useRef(false);

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
    // 🔇 En Level Up no debe reproducirse audio automáticamente.
    // Asegurar que cualquier audio previo quede detenido al entrar.
    if (didStopRef.current) return;
    didStopRef.current = true;
    stopSound();
  }, [stopSound]);

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

  const gameNameToAdminKey = (gameName) => {
    const normalized = String(gameName || "").toLowerCase();
    const map = {
      vocabulario: "vocabulary-game",
      escucha: "audio-game",
      pares: "pair-words",
      "otoño": "fall-module",
      otono: "fall-module",
      escritura: "writing-game",
      armar: "armar",
    };
    return map[normalized] || null;
  };

  const isGameEnabledAndVisible = (gameName) => {
    const key = gameNameToAdminKey(gameName);
    if (!key) return true;

    let isActive = getDefaultGameActive(key);
    let isVisible = getDefaultGameVisible(key);

    try {
      const activeConfig = JSON.parse(localStorage.getItem("adminGameConfig") || "{}");
      if (activeConfig[key] !== undefined) isActive = Boolean(activeConfig[key]);
    } catch (e) {}

    try {
      const visibilityConfig = JSON.parse(localStorage.getItem("adminGameVisibilityConfig") || "{}");
      if (visibilityConfig[key] !== undefined) isVisible = Boolean(visibilityConfig[key]);
    } catch (e) {}

    return isActive && isVisible;
  };

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

    // Buscar el siguiente juego DISPONIBLE (activo y visible)
    for (let i = idx + 1; i < gameOrder.length; i += 1) {
      const candidate = gameOrder[i];
      if (isGameEnabledAndVisible(candidate.name)) {
        return candidate.path + currentLetter;
      }
    }

    // Si no hay más juegos disponibles, volver al menú
    return '/';
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
            <div className="logoFondoAzulCircle">
              <img className="logo" src={logoFondoAzul} alt="logoKoala" />
            </div>
            <div className="text-box" style={{ minWidth: 'auto' }}>
              <p>¡Felicitaciones!</p>
              <p>Lo has logrado</p>
            </div>
          </div>
          <div className="button-container" >
          {allowContinue && (
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
    </div>
  );
};

const LevelUpScreenComponent = ({ gameUrl, accuracy, canContinue, minAccuracyToContinue }) => {
  return (
    <div>
  <ComponentPortrait
    gameUrl={gameUrl}
    accuracy={accuracy}
    canContinue={canContinue}
    minAccuracyToContinue={minAccuracyToContinue}
  />
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
