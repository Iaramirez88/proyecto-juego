import React, { useEffect, useState } from "react";
import fondoMorado from "../../../assets/images/instructions/apoyoEmergenteMorado.svg";
import hand from "../../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";
import fondoBlanco from "../../../assets/images/instructions/apoyoEmergenteBlanco.svg";
import { useDimesions } from "../../../hooks/useDimesion";

const PairInstructions = ({ display }) => {
  const [image, setImage] = useState(fondoMorado);
  const dimension = useDimesions();
  useEffect(() => {
    if (!display) {
      let tl = gsap.timeline();
      tl.to("#finger", {
        duration: 1.5,
        x: dimension.width < 485 ? 15 : 45,
        y: 30,
      })
        .fromTo(
          "#finger",
          {
            scale: 1,
          },
          {
            duration: 1,
            scale: 0.8,
          }
        )
        .to("#finger", {
          duration: 0.7,
          scale: 1,
          onComplete: () => {
            setImage(fondoBlanco);
          },
        });
    }
  }, [display, dimension]);

  return (
    <div>
      <div className="pmModalRow">
        <img className="pmModalSquare" alt="square" src={image} />
        {Array(3)
          .fill(1)
          .map((item, index) => (
            <img
              className="pmModalSquare"
              alt="square"
              key={index}
              src={fondoMorado}
            />
          ))}
        <img id="finger" src={hand} alt="hand" className="pmModalHand" />
      </div>
      <div className="pmModalRow">
        {Array(4)
          .fill(1)
          .map((item, index) => (
            <img
              className="pmModalSquare"
              alt="square"
              key={index}
              src={fondoMorado}
            />
          ))}
      </div>
    </div>
  );
};

export default PairInstructions;
