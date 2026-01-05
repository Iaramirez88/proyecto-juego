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
      try {
        snd.preload = 'auto';
      } catch (e) {}
      currentAudio = snd;

      if (options.onEnded && typeof options.onEnded === 'function') {
        snd.addEventListener('ended', () => options.onEnded(), { once: true });
      }

      // Diagnóstico: si el recurso falla al cargar
      snd.addEventListener(
        'error',
        () => {
          try {
            // eslint-disable-next-line no-console
            console.warn('[audio] error loading', { src: snd.src, audio });
          } catch (e) {}
          if (options.onError && typeof options.onError === 'function') {
            options.onError(new Error('Audio load error'));
          }
        },
        { once: true }
      );

      // Intentar cargar antes de reproducir
      try {
        snd.load();
      } catch (e) {}

      const p = snd.play();
      if (p && typeof p.catch === 'function') {
        p.catch((err) => {
          // AbortError suele ocurrir cuando se llama a pause() porque otro audio va a sonar.
          if (err && (err.name === 'AbortError' || err.code === 20)) {
            return;
          }
          // eslint-disable-next-line no-console
          console.warn('[audio] play blocked/failed', { src: snd.src, audio, err });
          if (options.onError && typeof options.onError === 'function') {
            options.onError(err);
          }
          // Reintento cuando el audio esté listo
          const retry = () => {
            try {
              snd.play().catch(() => {});
            } catch (e) {}
          };
          try {
            snd.addEventListener('canplaythrough', retry, { once: true });
            snd.load();
          } catch (e) {}
        });
      }
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
