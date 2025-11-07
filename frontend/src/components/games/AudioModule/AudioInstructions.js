import gsap from "gsap/gsap-core";
import React, { useEffect } from "react";
import fondoAzul from "../../../assets/images/instructions/apoyoEmergenteAzul.svg";
import { iconSoundWhite } from "../../../utils/imagesResources";
import finger from "../../../assets/images/instructions/dedoTocas.svg";
import { useDimesions } from "../../../hooks/useDimesion";
import { usePlaySounds } from "../../../hooks/usePlaySounds";
import apoyo1 from "../../../assets/sounds/intructions/apoyo2ModEscucha.mp3";
import apoyo2 from "../../../assets/sounds/intructions/apoyoEnunciado1modEscucha.mp3";

const AudioInstructions = ({ display }) => {
  const dimension = useDimesions();
  const [playSound, , stopSound] = usePlaySounds();
  useEffect(() => {
    let tl = gsap.timeline();

    const infoButton = () =>
      new Promise((resolve) => {
        stopSound();
        playSound(apoyo1, { onEnded: () => resolve() });

        tl.to("#fingerAudio", {
          duration: 1.5,
          y: dimension.width < 485 ? 90 : 130,
        })
          .fromTo(
            "#fingerAudio",
            {
              scale: 1,
            },
            {
              duration: 1,
              scale: 0.8,
            }
          )
          .to("#fingerAudio", {
            duration: 0.7,
            scale: 1,
          });
      });

    const infoCard = async () =>
      new Promise((resolve) => {
        stopSound();
        playSound(apoyo2, { onEnded: () => resolve() });
        tl.to("#fingerAudio", {
          duration: 0.7,
          y: dimension.width < 485 ? 35 : 50,
          x: 45,
        })
          .fromTo(
            "#fingerAudio",
            {
              scale: 1,
            },
            {
              duration: 1,
              scale: 0.8,
            }
          )
          .to("#fingerAudio", {
            duration: 0.7,
            scale: 1,
          });
      });

    const startInstructions = async () => {
      await infoCard();
      setTimeout(() => {
        infoButton();
      }, 500);
    };

    if (!display) {
      startInstructions();
    }
  }, [display, dimension.width, playSound, stopSound]);
  return (
    <div className="aiModalBox">
      {!display && (
        <img
          src={finger}
          alt="finger"
          id="fingerAudio"
          className="aiModalFinger"
        />
      )}
      {Array(3)
        .fill(1)
        .map((item, index) => (
          <div className="aiModalItem" key={index}>
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
