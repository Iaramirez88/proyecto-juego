import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/main.css";
import { imageClose } from "../../utils/imagesResources";
import finger from "../../assets/images/instructions/dedoTocas.svg";
import gsap from "gsap/gsap-core";

const ModalComponent = ({ children, showModal, closeButton, playInfo }) => {
  const refClick = useRef();
  const [showFinger, setShowFinger] = useState(true);
  useEffect(() => {
    let clickPlay = refClick.current;
    if (!showModal) {
      clickPlay.addEventListener("click", () => {
        playInfo();
        setShowFinger(false);
      });

      if (showFinger) {
        setTimeout(() => {
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
    }
  }, [showModal, playInfo, showFinger]);

  return (
    <div className={`modalComponent ${showModal ? "" : "hidden"}`}>
      <div className={`${showFinger ? "aiCover" : ""}`}></div>
      <div ref={refClick} className="playButton">
        {showFinger && <img id="fingerModal" src={finger} alt="finger" />}►
      </div>

      <div className="mdButtonContainer">
        <button className="buttonClose" ref={closeButton}>
          <img src={imageClose} alt="close" />
        </button>
      </div>
      <div className="mdContainerBody">{children}</div>
    </div>
  );
};

export default ModalComponent;
