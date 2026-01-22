import { useCallback } from "react";
import { goodAnswer, wrongAnswer } from "../utils/sounds";

// Simple singleton audio controller: guarantees only one audio plays at a time
let currentAudio = null;

function safeStopAudio(audioEl) {
  if (!audioEl) return;
  try {
    audioEl.pause();
  } catch (e) {}
  try {
    audioEl.currentTime = 0;
  } catch (e) {}
}

export function stopAllAudioPlayback() {
  // Stop singleton audio
  if (currentAudio) {
    safeStopAudio(currentAudio);
    currentAudio = null;
  }

  // Stop any <audio>/<video> tags currently playing
  try {
    if (typeof document !== 'undefined') {
      const media = document.querySelectorAll('audio,video');
      media.forEach((el) => safeStopAudio(el));
    }
  } catch (e) {}
}

export function usePlaySounds() {
  const playSound = useCallback((audio, options = {}) => {
    try {
      // stop previous audio if any
      stopAllAudioPlayback();

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
  }, []);

  const stopSound = useCallback(() => {
    stopAllAudioPlayback();
  }, []);

  const getCurrent = useCallback(() => currentAudio, []);

  return [playSound, getCurrent, stopSound];
}

export function useResponseAudio() {
  // Reproduce el audio correcto de inmediato, sin delay y sin bug de índice
  const playResponseAudio = useCallback((type) => {
    // 🔧 Detener cualquier audio que esté sonando (incluyendo tags <audio>)
    stopAllAudioPlayback();
    
    const audio = type
      ? goodAnswer[Math.floor(Math.random() * goodAnswer.length)]
      : wrongAnswer[Math.floor(Math.random() * wrongAnswer.length)];
    const snd = new Audio(audio);
    snd.currentTime = 0;
    currentAudio = snd;
    const p = snd.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {});
    }
  }, []);
  return [playResponseAudio];
}
