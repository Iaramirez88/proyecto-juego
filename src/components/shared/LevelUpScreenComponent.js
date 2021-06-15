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

const ComponentPortrait = () => {
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
    let timer;
    let items = [resBien, RestExcelente, RestFelicitaciones, ResvMuybien];
    const aud = items[Math.floor(Math.random() * items.length)];
    setAudio(aud);
    timer = setTimeout(() => {
      history.push("/");
    }, 3000);

    window.addEventListener("orientationchange", orientationChange);

    return () => {
      window.removeEventListener("orientationchange", orientationChange);
      clearTimeout(timer);
    };
  }, []);

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
        </div>
      </div>
      {sound && <audio src={sound} autoPlay />}
    </div>
  );
};

const LevelUpScreenComponent = () => {
  return (
    <div>
      <ComponentPortrait />
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
