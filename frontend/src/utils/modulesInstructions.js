import introAudio from "../assets/sounds/intructions/introModAudio.mp3";
import introAudioL from "../assets/sounds/intructions/EnunciadoSelecImagenes.mp3";
import introAudioFall from "../assets/sounds/intructions/enunciadoOtonnoVocal.mp3";
import introAudioFallLeter from "../assets/sounds/intructions/EnunciadoSelecMismaLetra.mp3";
import soundA from "../assets/sounds/intructions/vocalAa.mp3";
import soundE from "../assets/sounds/intructions/e.mp3";
import soundI from "../assets/sounds/intructions/i.mp3";
import soundO from "../assets/sounds/intructions/o.mp3";
import soundU from "../assets/sounds/intructions/u.mp3";
import soundm from "../assets/sounds/intructions/LetraM.mp3";

import modAudioA from "../assets/sounds/intructions/modAudioA.mp3";
import modAudioE from "../assets/sounds/intructions/modAudioE.mp3";
import modAudioI from "../assets/sounds/intructions/modAudioI.mp3";
import modAudioO from "../assets/sounds/intructions/EnunciadoModEscucha2O.mp3";
import modAudioU from "../assets/sounds/intructions/euniciadoModEscucha2U.mp3";

import escuchaA from "../assets/sounds/intructions/e_escucha_a.mp3";
import escuchaE from "../assets/sounds/intructions/e_escucha_e.mp3";
import escuchaI from "../assets/sounds/intructions/e_escucha_i.mp3";
import escuchaO from "../assets/sounds/intructions/e_escucha_o.mp3";
import escuchaU from "../assets/sounds/intructions/e_escucha_u.mp3";
export const modulesInstructions = {
  vocabulary: {
    audio: 0,
    modal: 0,
  },
  audio: {
    audio: 0,
    modal: 0,
  },
  pair: {
    audio: 0,
    modal: 0,
  },
  fall: {
    audio: 0,
    modal: 0,
  },
  writting: {
    audio: 0,
    modal: 0,
  },
  puzzle: {
    audio: 0,
    modal: 0,
  },
  draw: {
    audio: 0,
    modal: 0,
  },
};

export const autioTitleIntructions = {
  vocabulary: {
    a: [],
  },
  write: {},
  fall: {
    intro: introAudioFall,
    introL: introAudioFallLeter,
    letter: {
      a: soundA,
      e: soundE,
      i: soundI,
      o: soundO,
      u: soundU,
      m: soundm,
    },
  },
  pair: {},
  audio: {
    intro: introAudio,
    introL: introAudioL,
    fullByVowel: {
      a: escuchaA,
      e: escuchaE,
      i: escuchaI,
      o: escuchaO,
      u: escuchaU,
    },
    letter: {
      a: modAudioA,
      e: modAudioE,
      i: modAudioI,
      o: modAudioO,
      u: modAudioU,
      m: soundm,
    },
  },
};
