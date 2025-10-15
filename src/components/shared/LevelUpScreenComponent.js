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
    var tl = gsap.timeline();

    tl.from(".container-second", {
      y: container.height2,
      duration: 1,
      opacity: 0,
    });
    tl.from(".logo", { duration: 1, opacity: 0, scale: 0.5 });
  }, [container]);

  return (
    <div>
      <Header onGoBack={() => history.push("/")}></Header>
      <div className={` container-sup `}>
        <div
          className="container-second"
          style={{ height: `${container.height2}px` }}
        >
          <img className="logo" src={logoFondoAzul} alt="logoKoala" />
          <div className="text-box">
            <p>¡Felicitaciones!</p>
            <p>Lo has logrado</p>
          </div>
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <button onClick={handleContinue} style={{ padding: '10px 24px', fontSize: 18, borderRadius: 8, background: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}>Continuar</button>
            <button onClick={handleMenu} style={{ padding: '10px 24px', fontSize: 18, borderRadius: 8, background: '#2196f3', color: '#fff', border: 'none', cursor: 'pointer' }}>Volver al menú</button>
            <button onClick={handleRepeat} style={{ padding: '10px 24px', fontSize: 18, borderRadius: 8, background: '#ff9800', color: '#fff', border: 'none', cursor: 'pointer' }}>Repetir juego</button>
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
