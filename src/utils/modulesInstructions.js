import introAudio from "../assets/sounds/intructions/introModAudio.mp3";
import introAudioFall from "../assets/sounds/intructions/enunciadoOtonnoVocal.mp3";
import soundA from "../assets/sounds/intructions/vocalAa.mp3";

import modAudioA from "../assets/sounds/intructions/modAudioA.mp3";
import modAudioE from "../assets/sounds/intructions/modAudioE.mp3";

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
      e: modAudioE,
    },
  },
  pair: {},
  audio: {
    intro: introAudio,
    letter: {
      a: modAudioA,
      e: modAudioE,
    },
  },
};
