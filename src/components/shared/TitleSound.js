import React, { useEffect, useRef, useState } from "react";
import { iconSound } from "../../utils/imagesResources";
import { usePlaySounds } from "../../hooks/usePlaySounds";

export const TitleSound = ({ title, titleSound, listAudio }) => {
  const [playSound] = usePlaySounds();
  const refAudio = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    let audio = refAudio.current;
    if (!play) {
      audio.addEventListener("ended", () => {
        let snd = new Audio(listAudio[1]);
        snd.play();
        setPlay(false);
      });
    }
  }, [listAudio, play]);

  return (
    <div className="titleGame">
      <h2>
        <img
          onClick={() => playSound(titleSound)}
          src={iconSound}
          alt="iconSound"
        />

        <audio ref={refAudio} src={listAudio[0]} autoPlay />
        {title}
      </h2>
    </div>
  );
};

export default TitleSound;
