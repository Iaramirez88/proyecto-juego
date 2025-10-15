import { goodAnswer, wrongAnswer } from "../utils/sounds";

export function usePlaySounds() {
  
  let snd = null;
  const playSound = (audio) => {
    snd = new Audio(audio);
    snd.play();
  };

  return [playSound, snd];
}

export function useResponseAudio() {
  // Reproduce el audio correcto de inmediato, sin delay y sin bug de índice
  const playResponseAudio = (type) => {
    const audio = type
      ? goodAnswer[Math.floor(Math.random() * goodAnswer.length)]
      : wrongAnswer[Math.floor(Math.random() * wrongAnswer.length)];
    const snd = new Audio(audio);
    snd.currentTime = 0;
    snd.play();
  };
  return [playResponseAudio];
}
