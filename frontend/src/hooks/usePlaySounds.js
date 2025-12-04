import { goodAnswer, wrongAnswer } from "../utils/sounds";

// Simple singleton audio controller: guarantees only one audio plays at a time
let currentAudio = null;

export function usePlaySounds() {
  const playSound = (audio, options = {}) => {
    try {
      // stop previous audio if any
      if (currentAudio) {
        try {
          currentAudio.pause();
        } catch (e) {}
        try {
          currentAudio.currentTime = 0;
        } catch (e) {}
        currentAudio = null;
      }

      const snd = new Audio(audio);
      currentAudio = snd;

      if (options.onEnded && typeof options.onEnded === 'function') {
        snd.addEventListener('ended', () => options.onEnded());
      }

      snd.play().catch(() => {
        // ignore play errors (autoplay policies)
      });
      return snd;
    } catch (err) {
      // fallback: create audio anyway
      const snd = new Audio(audio);
      currentAudio = snd;
      snd.play().catch(() => {});
      return snd;
    }
  };

  const stopSound = () => {
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {}
      currentAudio = null;
    }
  };

  const getCurrent = () => currentAudio;

  return [playSound, getCurrent, stopSound];
}

export function useResponseAudio() {
  // Reproduce el audio correcto de inmediato, sin delay y sin bug de índice
  const playResponseAudio = (type) => {
    // 🔧 Detener cualquier audio del tutorial que esté sonando
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {}
      currentAudio = null;
    }
    
    const audio = type
      ? goodAnswer[Math.floor(Math.random() * goodAnswer.length)]
      : wrongAnswer[Math.floor(Math.random() * wrongAnswer.length)];
    const snd = new Audio(audio);
    snd.currentTime = 0;
    snd.play();
  };
  return [playResponseAudio];
}
