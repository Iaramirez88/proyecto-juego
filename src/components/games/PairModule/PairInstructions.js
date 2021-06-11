import React, { useEffect, useState } from "react";
import fondoMorado from "../../../assets/images/instructions/apoyoEmergenteMorado.svg";
import hand from "../../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";
import fondoBlanco from "../../../assets/images/instructions/apoyoEmergenteBlanco.svg";
import { useDimesions } from "../../../hooks/useDimesion";
import audioPares from "../../../assets/sounds/intructions/apoyoModPares.mp3";

const PairInstructions = ({ display }) => {
  const [image, setImage] = useState(fondoMorado);
  const dimension = useDimesions();
  useEffect(() => {
    const startInfo = () => {
      // let audio = new Audio(audioPares);
      // audio.play();

      let tl = gsap.timeline();
      tl.to("#fingerPair", {
        duration: 2,
        x: dimension.width < 485 ? 15 : 45,
        y: 30,
      })
        .fromTo(
          "#fingerPair",
          {
            scale: 1,
          },
          {
            duration: 1,
            scale: 0.8,
          }
        )
        .to("#fingerPair", {
          duration: 1,
          scale: 1,
          onComplete: () => {
            setImage(fondoBlanco);
          },
        });
    };

    if (!display) {
      setTimeout(() => {
        startInfo();
      }, 500);
    }
  }, [display, dimension]);

  return (
    <div className="pmModalBox">
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
        {!display && (
          <img id="fingerPair" src={hand} alt="hand" className="pmModalHand" />
        )}
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
