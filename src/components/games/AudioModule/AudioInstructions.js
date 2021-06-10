import gsap from "gsap/gsap-core";
import React, { useEffect } from "react";
import fondoAzul from "../../../assets/images/instructions/apoyoEmergenteAzul.svg";
import { iconSoundWhite } from "../../../utils/imagesResources";
import finger from "../../../assets/images/instructions/dedoTocas.svg";
import { useDimesions } from "../../../hooks/useDimesion";

const AudioInstructions = ({ display }) => {
  const dimension = useDimesions();

  useEffect(() => {
    if (!display) {
      let tl = gsap.timeline();
      tl.to("#finger", {
        duration: 1.5,
        x: dimension.width < 485 ? 30 : 55,
        y: dimension.width < 485 ? 90 : 130,
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
        })
        .to("#finger", {
          duration: 0.7,
          y: dimension.width < 485 ? 35 : 50,
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
        });
    }
  }, [display, dimension]);
  return (
    <div className="aiModalBox">
      <img src={finger} alt="finger" id="finger" className="aiModalFinger" />
      {Array(3)
        .fill(1)
        .map((item, index) => (
          <div className="aiModalItem">
            <img src={fondoAzul} alt="fondoAzul" className="aiModalCard" />
            <img
              src={iconSoundWhite}
              alt="iconSoundWhite"
              className="aiModalButton"
            />
          </div>
        ))}
    </div>
  );
};

export default AudioInstructions;
