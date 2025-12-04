import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import background from "../../assets/images/background/fondoModOtonno.svg";
import Header from "../../components/shared/Header";
import TitleSound from "../../components/shared/TitleSound";
import { GameContext } from "../../context/GameContext";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import { getData } from "../../utils/mockData/modFall";
import "../../assets/styles/fall-module.css";
import { useTransitionGame } from "../../hooks/useTransitionGame";
import { useResponseAudio } from "../../hooks/usePlaySounds";
import FallInstructions from "../../components/games/FallModule/FallInstructions";
import { autioTitleIntructions } from "../../utils/modulesInstructions";
import { useSetScrollPosition } from "../../hooks/useDimesion";

// Importación para progreso automático - SISTEMA LOCAL
import { useLocalGameProgress } from "../../hooks/useLocalGameProgress";

// 🎮 Importaciones para Gamificación
import GamificationFeedback from "../../components/games/GamificationFeedback";
import { useGamificationFeedback } from "../../hooks/useGamificationFeedback";

const FallModule = () => {
  useSetBackGround(background);
  useSetScrollPosition();

  const { dispatch } = useContext(GameContext);
  const history = useHistory();
  let { id } = useParams();
  let enunciado = ""; 
  let audio;
  const [playResponseAudio] = useResponseAudio();
  const instructions = autioTitleIntructions.fall;
  const [state, setState] = useState({
    words: [],
    current: [],
    next: false,
    isLoading: false,
    letter: "",
    position: 0,
  });
  const [transition, setTransition] = useTransitionGame(".containerGame");

  // Hook para progreso automático - Sistema Local
  const {
    updateScore,
    markAsCompleted
  } = useLocalGameProgress('fall-module', id);

  // 🎮 Hook para gamificación
  const {
    showFeedback,
    performance,
    customMessage,
    triggerFeedback,
    showSimpleFeedback,
    hideFeedback
  } = useGamificationFeedback();

  // 📊 Estados para tracking de accuracy
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  useEffect(() => {
    const init = () => {
      const response = getData(id);
      const data = prepareData(response[0]);
      setState({
        ...state,
        words: response,
        current: data,
        isLoading: true,
        letter: setPrincipalLetter(id),
      });
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const selectItem = (index) => {
    const { position } = state;

    const current = [...state.current];
    const letter = current[index].name;
    const isCorrect = state.letter.toLowerCase() === letter.toLowerCase();
    current[index].isCorrect = isCorrect;

    // 📊 Actualizar contadores de accuracy
    if (isCorrect) {
      setCorrectAttempts(prev => prev + 1);
    } else {
      setIncorrectAttempts(prev => prev + 1);
    }

    setState({
      ...state,
      current,
    });
    dispatch({
      type: "ADD_POINTS",
      value: isCorrect ? 1 : -1,
    });

    if (isCorrect) {
      playResponseAudio(isCorrect);

      // Guardar progreso incremental para cada respuesta correcta con sistema local
      const progressScore = 50; // Puntos base por respuesta correcta
      const timeBonus = 5; // Bonus fijo
      const totalScore = progressScore + timeBonus;
      const currentProgress = (position + 1) * 55; // Score acumulado

      try {
        // Actualizar score con sistema local
        updateScore(currentProgress, {
          currentQuestion: position + 1,
          totalQuestions: state.words.length,
          correctAnswers: position + 1,
          level: id,
          letter: state.letter
        });
        
        console.log('Respuesta correcta! Score:', totalScore);
      } catch (error) {
        console.log('Progress save failed, but continuing game:', error);
      }

      if (position + 1 >= state.words.length) {
        // Juego completado - guardar progreso final
        const finalScore = (state.words.length * 50) + (5 * state.words.length);
        
        // 📊 Calcular accuracy y estrellas
        const totalAttempts = correctAttempts + incorrectAttempts;
        const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 100;
        
        // Determinar estrellas basadas en accuracy
        let stars = 0;
        if (accuracy >= 90) stars = 3;
        else if (accuracy >= 70) stars = 2;
        else if (accuracy >= 50) stars = 1;
        
        try {
          // Marcar juego como completado con sistema local
          markAsCompleted(finalScore, {
            totalQuestions: state.words.length,
            correctAnswers: state.words.length,
            finalScore: finalScore,
            level: id,
            letter: state.letter,
            completed: true,
            accuracy: Math.round(accuracy),
            stars,
            correctAttempts,
            incorrectAttempts
          });
          
          console.log('🍂 Otoño completado! Score:', finalScore, 'Accuracy:', accuracy.toFixed(1) + '%', 'Estrellas:', stars);
        } catch (error) {
          console.log('Progress save failed, but continuing to next level:', error);
        }

        // 🎮 Mostrar feedback gamificado con estrellas
        setTimeout(() => {
          const motivationalMessage = stars >= 3 ? '¡Perfecto! ¡Excelente trabajo! 🎉👏' :
                                       stars >= 2 ? '¡Muy bien! ¡Sigue así! 😊⭐' :
                                       stars >= 1 ? '¡Buen intento! ¡Puedes mejorar! 💪' :
                                       '¡No te rindas! ¡Inténtalo de nuevo! 🎓';
          triggerFeedback(accuracy, motivationalMessage);
        }, 1000);

        setTimeout(() => {
          history.replace({ pathname: "/level-up", state: { gameUrl: `/otoño/${id}` } });
        }, 4500);
        return;
      }
      setTimeout(() => {
        setTransition(isCorrect);
        setState({
          ...state,
          current: prepareData(state.words[position + 1]),
          position: position + 1,
        });
      }, 1000);
    }
  };

  if (!state.isLoading) return <div></div>;

  if(state.letter==="a"||
    state.letter==="e"||
    state.letter==="i"||
    state.letter==="o"||
    state.letter==="u"||
    state.letter==="A"||
    state.letter==="E"||
    state.letter==="I"||
    state.letter==="O"||
    state.letter==="U"){
    enunciado = `Selecciona la misma vocal ${id}`;
    audio = instructions.intro;
  }else{
    enunciado = `Selecciona la misma letra ${id}`;
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
        listAudio={[audio , instructions.letter[id]]}
        ModalChild={FallInstructions}
        module="fall"
      />
      <div className={`containerBox fmContainerBox`}>
        <div className="fmItem fmPrincipalLetter">
          <p className="fmCardWord greenLeef">{state.letter}</p>
        </div>
        <div className="fmOptionsLetters">
          <ItenLetter
            selectItem={() => selectItem(0)}
            styles="fmItem fmRightItem fmSecondRow"
            title={state.current[0].name}
            principal={state.letter}
            isCorrect={state.current[0].isCorrect}
          />
          <ItenLetter
            selectItem={() => selectItem(1)}
            styles="fmItem fmSecondRow"
            title={state.current[1].name}
            principal={state.letter}
            isCorrect={state.current[1].isCorrect}
          />
          <ItenLetter
            selectItem={() => selectItem(2)}
            styles="fmItem fmRightItem fmPrincipalLetter"
            title={state.current[2].name}
            principal={state.letter}
            isCorrect={state.current[2].isCorrect}
          />
        </div>
      </div>

      {/* 🎮 Componente de Gamificación */}
      <GamificationFeedback
        show={showFeedback}
        performance={performance}
        customMessage={customMessage}
        onComplete={hideFeedback}
      />
    </div>
  );
};

const ItenLetter = ({ selectItem, styles, title, principal, isCorrect }) => {
  const setBackground = (isCorrect) => {
    if (isCorrect === null) return "vocalLeef";
    if (isCorrect) return "goodLeef";
    return "wrongLeef";
  };

  const setCase = (principal, letter) => {
    return isUpper(principal) ? letter.toUpperCase() : letter.toLowerCase();
  };

  const isUpper = (letter) => {
    return letter === letter.toUpperCase();
  };

  return (
    <div onClick={selectItem} className={styles}>
      <p
        className={`fmCardWord ${setBackground(isCorrect)} ${
          title.toUpperCase() === "I" && isUpper(principal) ? "fmIgothic" : ""
        }`}
      >
        {setCase(principal, title)}
      </p>
    </div>
  );
};

const prepareData = (data) => {
  return data.map((item) => ({ ...item, isCorrect: null }));
};

const setPrincipalLetter = (letter) => letter;

export default FallModule;
