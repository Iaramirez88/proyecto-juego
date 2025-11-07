import React, { useEffect, useState } from "react";
import "../../assets/styles/shared-screen.css";
import logoFondoAzul from "../../assets/images/logoFondoAzul.svg";
import gsap from "gsap";

const ComponentPortrait = ({ isVisible }) => {
  const [container, setContainer] = useState(initialHeight());
  const [isLandscape, setIsLandscape] = useState(getOrientation());
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

    window.addEventListener("orientationchange", orientationChange);

    return () => {
      window.removeEventListener("orientationchange", orientationChange);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      var tl = gsap.timeline();

      tl.from(".container-second", {
        y: container.height2,
        duration: 1,
        opacity: 0,
      });
      tl.from(".container-first", {
        y: container.height2,
        duration: 1,
        opacity: 0,
      });
      tl.from(".logo", { duration: 1, opacity: 0, scale: 0.5 });
    }
  }, [container, isVisible]);

  return (
    <div className={`${!isVisible ? "hidden" : ""} container-sup `}>
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
  );
};

const CongratulationScreen = ({ isVisible }) => {
  return (
    <div>
      <ComponentPortrait isVisible={isVisible} />
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

export default CongratulationScreen;
