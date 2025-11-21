import React, { useContext, useEffect, useState } from "react";
import gsap from "gsap/gsap-core";
import { useHistory, useParams } from "react-router-dom";

import Header from "../../components/shared/Header";
import { autioTitleIntructions } from "../../utils/modulesInstructions";
import TitleSound from "../../components/shared/TitleSound";
import { GameContext } from "../../context/GameContext";
import {
  CardComponent,
  BottonAudioComponent,
} from "../../components/games/CardComponent";
import { useResponseAudio } from "../../hooks/usePlaySounds";

import { getData } from "../../utils/mockData/modAudio";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import backGround from "../../assets/images/fondoModEscGranAlto.svg";
import AudioInstructions from "../../components/games/AudioModule/AudioInstructions";
import { useSetScrollPosition } from "../../hooks/useDimesion";

// Importación para progreso automático - Sistema Local
import { useLocalGameProgress } from "../../hooks/useLocalGameProgress";

export const AudioScreen = () => {
  useSetBackGround(backGround);
  useSetScrollPosition();

  const { idLetter } = useParams();

  const [playResponseAudio] = useResponseAudio();
  const [transition, setTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({});
  const { dispatch } = useContext(GameContext);
  const history = useHistory();
  const instructions = autioTitleIntructions.audio;

  // Hook para progreso automático - Sistema Local
  const {
    updateScore,
    markAsCompleted
  } = useLocalGameProgress('audio-game', idLetter);

  const checkWord = (e, cardState, setCardState) => {
    let word = e.target.alt || e.target.dataset.word;
    let isCorrect = word[0] === state.response;
    let value = isCorrect ? 1 : -1;
    let cardObject = {
      isVisible: true,
      isCorrect: isCorrect,
      typeClass: isCorrect ? "good" : "wrong",
      visited: true,
    };
    if (!cardState.visited) {
      playResponseAudio(isCorrect);
      setCardState(cardObject);
      dispatch({
        type: "ADD_POINTS",
        value,
      });
      // Delay de 1 segundo antes de avanzar
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          checked: (prev.checked || 0) + 1,
          spring: isCorrect ? (prev.spring || 0) + 1 : 0,
        }));
      }, 1000);
    }
  };

  useEffect(() => {
    let data = getData(idLetter);
    setState({
      words: data,
      current: data[0],
      response: idLetter.toLowerCase(),
      checked: 0,
      position: 0,
      spring: 0,
    });
    setIsLoading(true);
  }, [idLetter]);

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
    let status = { ...state };
    // Obtener el tamaño del grupo actual a partir de words[position] (más robusto)
    const itemsInCurrent = status.words && status.words[status.position] ? status.words[status.position].length : 0;
    
    if (status.spring === 2 || status.checked === 3 || (itemsInCurrent > 0 && status.checked >= itemsInCurrent)) {
      // Grupo actual completado - guardar progreso incremental
      const groupsCompleted = status.position + 1;
      const totalGroups = status.words ? status.words.length : 0;
      const progressScore = groupsCompleted * 75; // 75 puntos por grupo completado
      
      try {
        updateScore(progressScore, {
          groupsCompleted,
          totalGroups,
          currentGroup: status.position + 1,
          level: idLetter,
          correctAnswers: status.spring || status.checked
        });
        console.log(`🔊 Audio - Grupo ${groupsCompleted} completado! Score:`, progressScore);
      } catch (error) {
        console.log('Error guardando progreso incremental audio:', error);
      }

      if (status.position + 1 < totalGroups) {
        const nextPos = parseInt(status.position + 1);
        setTransition(true);
        setState((prev) => ({
          ...prev,
          checked: 0,
          position: nextPos,
          current: prev.words ? prev.words[nextPos] : prev.current,
          spring: 0,
          verified: false,
        }));
      } else {
        // Juego completado - guardar progreso final
        const finalScore = totalGroups * 75; // Score final basado en grupos
        
        try {
          markAsCompleted(finalScore, {
            groupsCompleted: totalGroups,
            totalGroups,
            level: idLetter,
            completed: true,
            gameType: 'audio-recognition'
          });
          console.log('🎉 Audio completado! Score final:', finalScore);
        } catch (error) {
          console.log('Error guardando progreso final audio:', error);
        }

        history.push("/level-up", { gameUrl: `/escucha/${idLetter}` });
      }
    }
  }, [state, history, idLetter, updateScore, markAsCompleted]);

  if (!isLoading) return <div></div>;

  let enunciado = ""; 
  let audio;

  if(idLetter==="a"||idLetter==="e"||idLetter==="i"||idLetter==="o"||idLetter==="u"||idLetter==="A"||idLetter==="E"||idLetter==="I"||idLetter==="O"||idLetter==="U"){
    enunciado = `Selecciona las imágenes que empiezan con la vocal ${idLetter}`;
    audio = instructions.intro;
  }else{
    enunciado = `Selecciona las imágenes que empiezan con la letra ${idLetter}`;
    audio = instructions.introL;
  }

  return (
    <div
      className="containerGame"
      style={transition ? { overflowX: "hidden" } : {}}
    >
      <Header></Header>
      <TitleSound
        title={enunciado}
        titleSound={instructions}
        listAudio={[audio, instructions.letter[idLetter]]}
        ModalChild={AudioInstructions}
        module="audio"
      />
      <div className="containerBox">
        <div className="containerOptions audioBox">
          {state.current.length > 0 &&
            state.current.map((item) => (
              <div
                className="containerAudio"
                key={item.id}
                data-index={item.id}
              >
                <CardComponent
                  styles="cardAudio"
                  image={item.image}
                  alt={item.name}
                  name={item.name}
                  checkWord={checkWord}
                />
                <BottonAudioComponent audio={item.sound} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AudioScreen;
