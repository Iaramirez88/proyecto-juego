import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import instruction from "../../assets/sounds/intructions/enunciadoOtonnoVocal.mp3";
import vocalA from "../../assets/sounds/intructions/vocalAa.mp3";

const Others = () => {
  const [getDataLocal] = useLocalStorage("others");
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) {
      let aud = new Audio(instruction);
      aud.autoplay = true;
      aud.play();
    }
  }, [play]);

  return <div>route others</div>;
};

export default Others;
