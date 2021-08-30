import React, { useEffect, useRef, useState } from "react";
import { iconSound } from "../../utils/imagesResources";
import finger from "../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";
import ModalComponent from "./ModalComponent";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useDimesions } from "../../hooks/useDimesion";

export const TitleSound = ({
  title,
  titleSound,
  listAudio,
  ModalChild,
  module,
}) => {
  const { getDataLocal, setDataLocal } = useLocalStorage("instructions");
  const display = getDataLocal(module);
  const dimension = useDimesions();
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [runInfo, setRunInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const closeButton = useRef(null);

  const setAudioPlay = (sounds) => {
    setShowInfo(false);
    let snd = new Audio(sounds[0]);
    snd.play();
    if (sounds.length > 1) {
      snd.addEventListener("ended", () => {
        let sndVocal = new Audio(sounds[1]);
        sndVocal.play();
      });
      return;
    }
  };


  const playInfo = () => {
    setRunInfo(false);
  };

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
  }, [loading, display, setDataLocal, module]);

  const[state,setState]= useState(false);
  function on(){
    setTimeout(() => {
      setAudioPlay(listAudio);
      setState(true);
    }, 1);
    setTimeout(() => {
      setState(false);
    }, 6000);
  };

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
        <button id="buttontitle"  disabled={state} onClick={()=> on()}>
        <img
          src={iconSound}
          alt="iconSound"
        />
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
