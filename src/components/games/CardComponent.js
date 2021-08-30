import React, { useState } from "react";
import { iconSoundWhite } from "../../utils/imagesResources";
import bien from "../../assets/images/bien.svg";
import wrong from "../../assets/images/respuestaNo.svg";
import { usePlaySounds } from "../../hooks/usePlaySounds";

export const CardComponent = ({ image, alt, styles, name, checkWord }) => {
  const [state, setState] = useState(initialState());

  return (
    <div
      data-word={name.toLowerCase()}
      className={`cardImage ${styles}`}
      onClick={(e) => checkWord(e, state, setState)}
    >
      <img className="imageCard" src={image} alt={alt.toLowerCase()} />
      <CardResponse {...state} />
    </div>
  );
};

export const CardResponse = ({ isCorrect, typeClass, isVisible }) => {
  let image = isCorrect ? bien : wrong;
  return (
    <div
      className={`cardResponseAudio ${typeClass} ${!isVisible ? "hidden" : ""}`}
    >
      <img width="100px" height="auto" alt="response" src={image} />{" "}
    </div>
  );
};

export const BottonAudioComponent = ({ audio, styles }) => {
  const [playSound,and,] = usePlaySounds();
  const[state,setState]= useState(false);
  function on(){
    setTimeout(() => {
      setState(true);
    }, 1);
    setTimeout(() => {
      setState(false);
    }, 3000);
    playSound(audio);
  };
  return (
    <button disabled={state} onClick={() => on()} className={`buttonAudio ${styles}`}>
     <img src={iconSoundWhite} alt="iconSoundWhite" />
    </button>
  );
};

function initialState() {
  return {
    isCorrect: false,
    isVisible: false,
    typeClass: "",
    visited: false,
  };
}
