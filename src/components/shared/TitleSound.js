import React, { useEffect, useRef, useState } from "react";
import { iconSound } from "../../utils/imagesResources";
import finger from "../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";
import ModalComponent from "./ModalComponent";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export const TitleSound = ({
  title,
  titleSound,
  listAudio,
  ModalChild,
  module,
}) => {
  const [getDataLocal, setDataLocal, batchSave] =
    useLocalStorage("instructions");
  const display = getDataLocal(module);
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
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

  useEffect(() => {
    const showInfoTitle = () => {
      let tl = gsap.timeline();
      tl.to("#finger", {
        duration: 1.5,
        x: 40,
        y: -15,
      })
        .fromTo(
          "#finger",
          {
            scale: 1,
          },
          {
            duration: 2,
            scale: 0.8,
          }
        )
        .to("#finger", {
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

  return (
    <div className="titleGame">
      <h2>
        <img
          id="finger"
          src={finger}
          alt="finger"
          className={`fingerInstructions ${!showInfo ? "hidden" : ""}`}
        />
        <img
          onClick={() => setAudioPlay(listAudio)}
          src={iconSound}
          alt="iconSound"
        />
        {title}
      </h2>
      {ModalChild && (
        <ModalComponent showModal={showModal} closeButton={closeButton}>
          <ModalChild />
        </ModalComponent>
      )}
    </div>
  );
};

export default TitleSound;
