

import React, { useCallback, useEffect, useRef, useState } from "react";
import { iconSound } from "../../utils/imagesResources";
import finger from "../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";
import ModalComponent from "./ModalComponent";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePlaySounds } from "../../hooks/usePlaySounds";
import { useDimesions } from "../../hooks/useDimesion";
import { ENABLE_TUTORIALS } from "../../config/tutorials";


const TitleSound = ({
  title,
  titleSound,
  listAudio,
  ModalChild,
  module,
  disableSound = false,
  showFinger = true,
  fingerPlaysAudio = true,
  hideFingerAfterAutoPlay = false,
  autoHideFingerAfterMs = null,
}) => {
  const tutorialsEnabled = ENABLE_TUTORIALS;
  const effectiveShowFinger = tutorialsEnabled ? showFinger : false;
  const EffectiveModalChild = tutorialsEnabled ? ModalChild : null;

  const { getDataLocal, setDataLocal } = useLocalStorage("instructions");
  const rawDisplay = module ? getDataLocal(module) : null;
  const display = rawDisplay && rawDisplay !== -1 ? rawDisplay : {};
  const dimension = useDimesions();
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [runInfo, setRunInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fingerDismissed, setFingerDismissed] = useState(false);
  const closeButton = useRef(null);
  const [state, setState] = useState(false);
  const isPlayingRef = useRef(false); // Track si está reproduciendo audio
  const autoHideFingerTimeoutRef = useRef(null);

  const [playSound, , stopSound] = usePlaySounds();

  const setAudioPlay = useCallback((sounds) => {
    if (disableSound) return;
    if (!sounds || sounds.length === 0) return;
    
    isPlayingRef.current = true; // Marcar que está reproduciendo
    
    if (sounds.length === 1) {
      playSound(sounds[0], {
        onEnded: () => {
          isPlayingRef.current = false;
        },
        onError: () => {
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
            },
            onError: () => {
              isPlayingRef.current = false;
            }
          });
        }
      },
      onError: () => {
        // Si el primero falla, intentar el segundo de todos modos
        if (isPlayingRef.current) {
          playSound(sounds[1], {
            onEnded: () => {
              isPlayingRef.current = false;
            },
            onError: () => {
              isPlayingRef.current = false;
            }
          });
        }
      }
    });
  }, [disableSound, playSound, stopSound]);

  const playInfo = () => {
    setRunInfo(false);
  };

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setShowInfo(true);

    // Primera vez: al cerrar el modal (gesto de usuario o auto-cierre), reproducir el audio del título
    if (!disableSound && !display.audio) {
      setAudioPlay(listAudio);
      if (hideFingerAfterAutoPlay) {
        setFingerDismissed(true);
      }
    }

    // Marcar como visto
    if (module) {
      setDataLocal(module, { audio: 1, modal: 1 });
    }

    // Animación del dedo del título (si aplica)
    try {
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
    } catch (e) {}
  }, [disableSound, display.audio, dimension.width, hideFingerAfterAutoPlay, listAudio, module, setAudioPlay, setDataLocal]);

  // 🔧 Cleanup: Detener audio cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (autoHideFingerTimeoutRef.current) {
        clearTimeout(autoHideFingerTimeoutRef.current);
        autoHideFingerTimeoutRef.current = null;
      }
      if (isPlayingRef.current) {
        stopSound();
        isPlayingRef.current = false;
      }
    };
  }, [stopSound]);

  // ⏱️ Auto ocultar el dedo tras N ms (útil para evitar que quede “pegado”)
  useEffect(() => {
    if (!showFinger) return;
    if (fingerDismissed) return;
    if (!showInfo) return;
    if (typeof autoHideFingerAfterMs !== "number") return;
    if (autoHideFingerAfterMs <= 0) return;

    if (autoHideFingerTimeoutRef.current) {
      clearTimeout(autoHideFingerTimeoutRef.current);
      autoHideFingerTimeoutRef.current = null;
    }

    autoHideFingerTimeoutRef.current = setTimeout(() => {
      autoHideFingerTimeoutRef.current = null;
      setFingerDismissed(true);
    }, autoHideFingerAfterMs);

    return () => {
      if (autoHideFingerTimeoutRef.current) {
        clearTimeout(autoHideFingerTimeoutRef.current);
        autoHideFingerTimeoutRef.current = null;
      }
    };
  }, [showFinger, fingerDismissed, showInfo, autoHideFingerAfterMs]);

  useEffect(() => {
    const startInteraction = async (display) => {
      // Deshabilitado temporalmente: no mostrar tutorial (modal/dedos)
      if (!tutorialsEnabled) {
        setShowModal(false);
        setShowInfo(true);
        return;
      }

      if (!display.modal) {
        // Si no hay ModalChild, solo marcar como visto y mostrar info
        if (!EffectiveModalChild) {
          setShowInfo(true);
          if (module) {
            setDataLocal(module, { audio: 1, modal: 1 });
          }
          return;
        }
        setShowModal(true);
      }
    };

    if (!loading && module) {
      startInteraction(display);
      setLoading(true);
    }
  }, [loading, display, setDataLocal, module, EffectiveModalChild, tutorialsEnabled]);

  function on() {
    if (disableSound) return;
    if (state) return; // Prevenir múltiples clicks mientras se reproduce
    if (!listAudio || listAudio.length === 0) return;
    
    // Reproducir directamente sin pasar por setAudioPlay
    setState(true);
    
    if (listAudio.length === 1) {
      playSound(listAudio[0], {
        onEnded: () => setState(false),
        onError: () => setState(false)
      });
    } else {
      // Si hay múltiples audios, reproducir el primero
      playSound(listAudio[0], {
        onEnded: () => {
          if (listAudio[1]) {
            playSound(listAudio[1], {
              onEnded: () => setState(false),
              onError: () => setState(false)
            });
          } else {
            setState(false);
          }
        },
        onError: () => setState(false)
      });
    }
  }

  return (
    <div className="titleGame">
      <h2>
        {effectiveShowFinger && !fingerDismissed && (
          <img
            id="fingerTitle"
            src={finger}
            alt="finger"
            className={`fingerInstructions ${!showInfo ? "hidden" : ""}`}
            onClick={fingerPlaysAudio ? () => setAudioPlay(listAudio) : undefined}
            style={fingerPlaysAudio ? undefined : { pointerEvents: "none" }}
          />
        )}
        <button
          id="buttontitle"
          disabled={state || disableSound}
          onClick={() => on()}
        >
          <img src={iconSound} alt="iconSound" />
        </button>
        {title}
      </h2>
      {EffectiveModalChild && (
        <ModalComponent
          playInfo={playInfo}
          showModal={showModal}
          closeButton={closeButton}
          onClose={handleCloseModal}
        >
          <EffectiveModalChild display={runInfo} onRequestClose={handleCloseModal} />
        </ModalComponent>
      )}
    </div>
  );
};

export default TitleSound;
