import React, { useEffect, useRef, useState } from "react";
import hand from "../../../assets/images/instructions/grabhand.svg";
import "../../../assets/styles/write-module.css";
import gsap from "gsap/gsap-core";
import { useDimesions } from "../../../hooks/useDimesion";
import audioHelp from "../../../assets/sounds/intructions/apoyoModEscritura.mp3";

const WrittingInstructions = ({ display }) => {
  const [audio, setAudio] = useState(null);
  const refAudio = useRef(null);
  const dimesion = useDimesions();
  useEffect(() => {
    let tagAudio = refAudio.current;
    if (!display) {
      setAudio(audioHelp);
      tagAudio && tagAudio.play();
      setTimeout(() => {
        gsap.to("#hand", {
          duration: 1,
          x: dimesion.width < 400 ? -25 : -45,
          y: dimesion.width < 400 ? -85 : -90,
        });
        gsap.to("#option", {
          duration: 1,
          x: dimesion.width < 485 ? -27 : -44,
          y: dimesion.width < 768 ? -83 : -100,
        });
      }, 1500);
    }
  }, [display, dimesion]);

  return (
    <div className="wrModalContainer">
      <div className="wrModalRow">
        <div className="cardBody" />
        <div className="cardBody" />
        <div className="cardBody" />
      </div>
      <div className="wrModalRow wrModalOptions">
        <div id="option" className="cardBody" />
        <div className="cardBody" />
        <img id="hand" className="wrHandGran" alt="hand" src={hand} />
      </div>
      {audio && <audio ref={refAudio} src={audio} autoPlay></audio>}
    </div>
  );
};

export default WrittingInstructions;
