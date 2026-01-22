import React, { useEffect, useState } from "react";
import leaf from "../../../assets/images/hojaVocale.svg";
import leafGood from "../../../assets/images/hojaRespuestaVerdadera.svg";
import hand from "../../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";

const FallInstructions = ({ display }) => {
  const [image, setImage] = useState(leaf);

  useEffect(() => {
    const init = () => {
      let tl = gsap.timeline();
      tl.fromTo(
        "#fiHand",
        {
          scale: 1,
        },
        {
          duration: 1,
          scale: 0.8,
        }
      ).to("#fiHand", {
        duration: 0.7,
        scale: 1,
        onComplete: () => {
          setImage(leafGood);
        },
      });
    };

    if (!display) {
      init();
    }
  }, [display]);

  return (
    <div>
      <div className="fiContainer">
        <div className="fiRow">
          <img alt="leaf" src={leaf} className="fiOption" />
        </div>
        <div className="fiRow">
          <img alt="leaf" src={image} className="fiOption" />
          <img alt="hand" id="fiHand" src={hand} className="fiHand" />
        </div>
        <div className="fiRow">
          <img alt="leaf" src={leaf} className="fiOption" />
        </div>
      </div>
    </div>
  );
};

export default FallInstructions;
