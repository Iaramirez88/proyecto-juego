import gsap from "gsap/gsap-core";
import React, { useEffect } from "react";
import squareBlue from "../../../assets/images/instructions/apoyoEmergenteAzul.svg";
import hand from "../../../assets/images/instructions/grabhand.svg";
import { useDimesions } from "../../../hooks/useDimesion";

const VocalIntructions = ({ display }) => {
  const dimension = useDimesions();

  useEffect(() => {
    const getPosition = () => {
      if (dimension.width <= 480) return { x: -45, y: -42 };
      if (dimension.width <= 768) return { x: -120, y: 60 };
      if (dimension.width <= 992) return { x: -120, y: 84 };
      if (dimension.width <= 1200) return { x: -150, y: 95 };
      return { x: -169, y: 120 };
    };

    const moveSquare = () => {
      let { x, y } = getPosition();
      const props = {
        duration: 2,
        x,
        y,
      };

      gsap.to("#viSquareGreen", props);
      gsap.to("#viHand", props);
    };

    if (!display) {
      moveSquare();
    }
  }, [display, dimension]);

  return (
    <div className="viContainer">
      <div className="viRow">
        <img alt="square-blue" src={squareBlue} className="viImage" />
        <div style={{ background: "#7eb8f9" }} className="viBox"></div>
      </div>
      <div className="viRow" id="viWordOptions">
        <div className="viBox" id="viSquareGreen"></div>
        <div className="viBox"></div>
        <img src={hand} className="viHand" id="viHand" alt="hand" />
      </div>
      <div className="viRow">
        <img alt="square-blue" src={squareBlue} className="viImage" />
        <div style={{ background: "#7eb8f9" }} className="viBox"></div>
      </div>
    </div>
  );
};

export default VocalIntructions;
