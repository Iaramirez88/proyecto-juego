import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/main.css";
import { imageClose } from "../../utils/imagesResources";
import finger from "../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";

const ModalComponent = ({ children, showModal, closeButton, playInfo, onClose }) => {
  const refClick = useRef();
  const [showFinger, setShowFinger] = useState(true);
  useEffect(() => {
    if (!showModal) return;

    const clickPlay = refClick.current;
    if (!clickPlay) return;

    const handlePlay = () => {
      playInfo();
      setShowFinger(false);
    };

    clickPlay.addEventListener("click", handlePlay, { once: true });

    let timeoutId = null;
    if (showFinger) {
      timeoutId = setTimeout(() => {
        const fingerElement = document.getElementById("fingerModal");
        if (fingerElement) {
          let tl = gsap.timeline();
          tl.to("#fingerModal", {
            x: -30,
            duration: 1.5,
          })
            .fromTo(
              "#fingerModal",
              {
                scale: 1,
              },
              {
                duration: 1,
                scale: 0.8,
              }
            )
            .to("#fingerModal", {
              duration: 0.7,
              scale: 1,
            });
        }
      }, 1000);
    }

    return () => {
      try {
        clickPlay.removeEventListener("click", handlePlay);
      } catch (e) {}
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showModal, playInfo, showFinger]);

  // Desmontar completamente cuando esté cerrado para evitar efectos colaterales (audio/timelines)
  if (!showModal) return null;

  return (
    <div className={`modalComponent ${showModal ? "" : "hidden"}`}>
      <div className={`${showFinger ? "aiCover" : ""}`}></div>
      <div ref={refClick} className="playButton">
        {showFinger && <img id="fingerModal" src={finger} alt="finger" />}►
      </div>

      <div className="mdButtonContainer">
        <button
          type="button"
          className="buttonClose"
          ref={closeButton}
          onClick={onClose}
        >
          <img src={imageClose} alt="close" />
        </button>
      </div>
      <div className="mdContainerBody">{children}</div>
    </div>
  );
};

export default ModalComponent;
