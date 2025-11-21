import React, { useRef, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import gsap from "gsap";

import { iconSoundWhite } from "../../utils/imagesResources";
import titleSound from "../../assets/sounds/moduloVocabulario.mp3";

import DragComponent from "../../components/games/DragComponent";
import ResponseComponent from "../../components/games/ResponseComponent";

import Header from "../../components/shared/Header";
import { getData } from "../../utils/mockData/modVocabulario";
import "../../assets/styles/games.css";
import "../../assets/styles/main.css";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import backGround from "../../assets/images/background_tramas.svg";
import TitleSound from "../../components/shared/TitleSound";
import { usePlaySounds } from "../../hooks/usePlaySounds";
import VocalIntructions from "../../components/games/VocalModule/VocalIntructions";
import { useSetScrollPosition } from "../../hooks/useDimesion";

// Importación para progreso automático - Sistema Local
import { useLocalGameProgress } from "../../hooks/useLocalGameProgress";

const Games = () => {
  let history = useHistory();
  useSetBackGround(backGround);
  useSetScrollPosition();
  const { idLetter } = useParams();

  const [position, setPosition] = useState(0);
  const [statusWord, setStatusWord] = useState({
    word1: false,
    word2: false,
  });
  const [transition, setTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  // El render de la palabra actual depende solo de position y list
  const boxResponse1 = useRef(null);
  const boxResponse2 = useRef(null);

  const [playSound, , stopSound] = usePlaySounds();
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);

  const dragRefs = useRef([]);

  // Hook para progreso automático - Sistema Local
  const {
    updateScore,
    markAsCompleted
  } = useLocalGameProgress('vocabulary-game', idLetter);

  useEffect(() => {
    if (statusWord.word1 && statusWord.word2) {
      // Par de palabras completado - guardar progreso incremental
      const wordsCompleted = position + 1;
      const progressScore = wordsCompleted * 100; // 100 puntos por par de palabras
      
      try {
        updateScore(progressScore, {
          wordsCompleted,
          totalWords: list.length,
          currentLevel: position + 1,
          level: idLetter
        });
        console.log(`📚 Vocabulario - Par ${wordsCompleted} completado! Score:`, progressScore);
      } catch (error) {
        console.log('Error guardando progreso incremental:', error);
      }

      dragRefs.current.forEach(ref => {
        if (ref && ref.resetDrag) ref.resetDrag();
      });
      
      if (position + 1 < list.length) {
        setPosition(position + 1);
        setStatusWord({
          word1: false,
          word2: false,
        });
        setTransition(true);
      } else {
        // Juego completado - guardar progreso final
        const finalScore = list.length * 100; // Score final
        
        try {
          markAsCompleted(finalScore, {
            wordsCompleted: list.length,
            totalWords: list.length,
            level: idLetter,
            completed: true,
            gameType: 'vocabulary'
          });
          console.log('🎉 Vocabulario completado! Score final:', finalScore);
        } catch (error) {
          console.log('Error guardando progreso final:', error);
        }

        history.push("/level-up", { gameUrl: `/vocabulario/${idLetter}` });
      }
    }
  }, [statusWord, position, history, list, idLetter, updateScore, markAsCompleted]);

  useEffect(() => {
    if (transition) {
      let tl = gsap.timeline();
      tl.from(".containerBox", {
        duration: 1,
        opacity: 0,
        x: window.innerWidth,
        onComplete: function () {
          setTransition(false);
        },
      });
    }
  }, [transition]);

  useEffect(() => {
    let data = getData(idLetter);
    setList(data);
    setPosition(0);
    setStatusWord({ word1: false, word2: false });
    setIsLoading(true);
  }, [idLetter]);

  // Asegurar que elementos estén desbloqueados cuando cambie la posición
  useEffect(() => {
    // Pequeño delay para asegurar que los componentes estén montados
    const timeoutId = setTimeout(() => {
      dragRefs.current.forEach(ref => {
        if (ref && ref.resetDrag) {
          ref.resetDrag();
        }
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [position]);

  function on() {
    setTimeout(() => {
      setState(true);
    }, 1);
    setTimeout(() => {
      setState(false);
    }, 3000);

    // stop any playing audio and play the requested sound
    stopSound();
    playSound(current.word2.sound);
  }
  function un() {
    setTimeout(() => {
      setState2(true);
    }, 1);
    setTimeout(() => {
      setState2(false);
    }, 3000);

    stopSound();
    playSound(current.word1.sound);
  }

  if (!isLoading || !list[position]) return <div></div>;

  const current = list[position];

  return (
    <div
      className="containerGame"
      style={transition ? { overflowX: "hidden" } : {}}
    >
      <Header></Header>
      <TitleSound
        title="Coloca la palabra al frente de cada imagen correspondiente"
        titleSound={titleSound}
        listAudio={[titleSound]}
        ModalChild={VocalIntructions}
        module="vocabulary"
      />
      <div className="containerBox">
        <div className="containerOptions">
          <div className="cardImage">
            <img
              className="imageCard"
              src={current.word1.image}
              alt={current.word1.name}
            />
          </div>
          <ResponseComponent
            reference={boxResponse1}
            word={current.word1.name}
            styles="containerResponse"
            position="word1"
            blocked={statusWord.word1}
          />
        </div>
        <div className={`containerWords`}>
          <DragComponent
            ref={el => dragRefs.current[0] = el}
            word={current.word2.name}
            divResponse={[boxResponse1, boxResponse2]}
            setStatusWord={setStatusWord}
            statusWord={statusWord}
          >
            <button
              onClick={() => on()}
              disabled={state}
              className="Buttongame"
            >
              <img src={iconSoundWhite} alt="iconSound" />
            </button>
            <h3>{current.word2.name}</h3>
          </DragComponent>
          <DragComponent
            ref={el => dragRefs.current[1] = el}
            word={current.word1.name}
            divResponse={[boxResponse1, boxResponse2]}
            setStatusWord={setStatusWord}
            statusWord={statusWord}
          >
            <button
              onClick={() => un()}
              disabled={state2}
              className="Buttongame"
            >
              <img src={iconSoundWhite} alt="iconSound" />
            </button>
            <h3>{current.word1.name}</h3>
          </DragComponent>
        </div>
        <div className="containerOptions">
          <div className="cardImage">
            <img
              className="imageCard"
              src={current.word2.image}
              alt={current.word2.name}
            />
          </div>
          <ResponseComponent
            reference={boxResponse2}
            word={current.word2.name}
            styles="containerResponse"
            position="word2"
            blocked={statusWord.word2}
          />
        </div>
      </div>
    </div>
  );
};

export default Games;
