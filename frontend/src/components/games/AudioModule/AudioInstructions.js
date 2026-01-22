import gsap from "gsap/gsap-core";
import React, { useEffect, useRef } from "react";
import fondoAzul from "../../../assets/images/instructions/apoyoEmergenteAzul.svg";
import { iconSoundWhite } from "../../../utils/imagesResources";
import finger from "../../../assets/images/instructions/dedoTocas.svg";
import { useDimesions } from "../../../hooks/useDimesion";
import { usePlaySounds } from "../../../hooks/usePlaySounds";
import apoyo1 from "../../../assets/sounds/intructions/apoyo2ModEscucha.mp3";
import apoyo2 from "../../../assets/sounds/intructions/apoyoEnunciado1modEscucha.mp3";

const AudioInstructions = ({ display, onRequestClose }) => {
  const dimension = useDimesions();
  const [playSound, , stopSound] = usePlaySounds();
  const didRunRef = useRef(false);
  useEffect(() => {
    // Solo ejecutar la guía UNA vez por montaje.
    if (display) return;
    if (didRunRef.current) return;
    didRunRef.current = true;

    const tl = gsap.timeline();
    let timeoutId = null;
    let cancelled = false;

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

    const infoCard = () =>
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
      if (cancelled) return;

      // Pequeña pausa para que se vea el gesto
      await new Promise((resolve) => {
        timeoutId = setTimeout(resolve, 500);
      });
      timeoutId = null;
      if (cancelled) return;

      await infoButton();
      if (cancelled) return;

      // Al terminar la guía, cerrar automáticamente el recuadro
      if (typeof onRequestClose === "function") {
        onRequestClose();
      }
    };

    startInstructions();

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      try {
        tl.kill();
      } catch (e) {}
      stopSound();
    };
  }, [display, dimension.width, playSound, stopSound, onRequestClose]);
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
