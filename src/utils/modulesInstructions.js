import introAudio from "../assets/sounds/intructions/introModAudio.mp3";
import introAudioFall from "../assets/sounds/intructions/enunciadoOtonnoVocal.mp3";
import soundA from "../assets/sounds/intructions/vocalAa.mp3";
import soundE from "../assets/sounds/intructions/e.mp3";
import soundI from "../assets/sounds/intructions/i.mp3";

import modAudioA from "../assets/sounds/intructions/modAudioA.mp3";
import modAudioE from "../assets/sounds/intructions/modAudioE.mp3";
import modAudioI from "../assets/sounds/intructions/modAudioI.mp3";

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
    letter: {
      a: soundA,
      e: soundE,
      i: soundI,
    },
  },
  pair: {},
  audio: {
    intro: introAudio,
    letter: {
      a: modAudioA,
      e: modAudioE,
      i: modAudioI,
    },
  },
};
