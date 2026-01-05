

import React, { useEffect, useRef, useState } from "react";
import { iconSound } from "../../utils/imagesResources";
import finger from "../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";
import ModalComponent from "./ModalComponent";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePlaySounds } from "../../hooks/usePlaySounds";
import { useDimesions } from "../../hooks/useDimesion";


const TitleSound = ({
  title,
  titleSound,
  listAudio,
  ModalChild,
  module,
  disableSound = false,
}) => {
  const { getDataLocal, setDataLocal } = useLocalStorage("instructions");
  const rawDisplay = module ? getDataLocal(module) : null;
  const display = rawDisplay && rawDisplay !== -1 ? rawDisplay : {};
  const dimension = useDimesions();
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [runInfo, setRunInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const closeButton = useRef(null);
  const [state, setState] = useState(false);
  const isPlayingRef = useRef(false); // Track si está reproduciendo audio

  const [playSound, , stopSound] = usePlaySounds();

  const setAudioPlay = (sounds) => {
    if (disableSound) return;
    setShowInfo(false);
    stopSound(); // Detener cualquier audio previo
    if (!sounds || sounds.length === 0) return;
    
    isPlayingRef.current = true; // Marcar que está reproduciendo
    
    if (sounds.length === 1) {
      playSound(sounds[0], {
        onEnded: () => {
          isPlayingRef.current = false;
        }
      });
      return;
    }
    // reproducir secuencialmente: primero sounds[0] y al terminar sounds[1]
    playSound(sounds[0], {
      onEnded: () => {
        if (isPlayingRef.current) { // Solo continuar si no se ha detenido
          playSound(sounds[1], {
            onEnded: () => {
              isPlayingRef.current = false;
            }
          });
        }
      },
    });
  };

  const playInfo = () => {
    setRunInfo(false);
  };

  // 🔧 Cleanup: Detener audio cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (isPlayingRef.current) {
        stopSound();
        isPlayingRef.current = false;
      }
    };
  }, [stopSound]);

  useEffect(() => {
    const showInfoTitle = () => {
      let tl = gsap.timeline();
      tl.to("#fingerTitle", {
        duration: 1.5,
        x: 40,
        y: dimension.width > 1200 ? 10 : -15,
      })
        .fromTo(
          "#fingerTitle",
          {
            scale: 1,
          },
          {
            duration: 2,
            scale: 0.8,
          }
        )
        .to("#fingerTitle", {
          duration: 0.7,
          scale: 1,
        });
    };

    const showModal = () => {
      setShowModal(true);
      return new Promise((resolve) => {
        let close = closeButton.current;
        close.addEventListener("click", () => {
          setShowModal(false);
          setShowInfo(true);
          // Primera vez: al cerrar el modal (gesto de usuario), reproducir el audio del título
          if (!disableSound && !display.audio) {
            setAudioPlay(listAudio);
          }
          resolve();
        });
      });
    };

    const startInteraction = async (display) => {
      if (!display.modal) {
        await showModal();
        showInfoTitle();
        setDataLocal(module, { audio: 1, modal: 1 });
      }
    };

    if (!loading && module) {
      startInteraction(display);
      setLoading(true);
    }
  }, [loading, display, setDataLocal, module, dimension]);

  function on() {
    if (disableSound) return;
    // Disparar audio sin delay para mantener el gesto de usuario
    setAudioPlay(listAudio);
    setState(true);
    setTimeout(() => {
      setState(false);
    }, 6000);
  }

  return (
    <div className="titleGame">
      <h2>
        <img
          id="fingerTitle"
          src={finger}
          alt="finger"
          className={`fingerInstructions ${!showInfo ? "hidden" : ""}`}
          onClick={() => setAudioPlay(listAudio)}
        />
        <button
          id="buttontitle"
          disabled={state || disableSound}
          onClick={() => on()}
        >
          <img src={iconSound} alt="iconSound" />
        </button>
        {title}
      </h2>
      {ModalChild && (
        <ModalComponent
          playInfo={playInfo}
          showModal={showModal}
          closeButton={closeButton}
        >
          <ModalChild display={runInfo} />
        </ModalComponent>
      )}
    </div>
  );
};

export default TitleSound;
