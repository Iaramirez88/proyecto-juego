import React, { useEffect, useContext, useState } from "react";
import gsap from "gsap";
import { useHistory, useParams } from "react-router-dom";

import { useSetBackGround } from "../../hooks/useSetBackGround";
import backGround from "../../assets/images/fondoModEscritura.svg";
import Header from "../../components/shared/Header";
import TitleSound from "../../components/shared/TitleSound";
import instructions from "../../assets/sounds/completaPalabra.mp3";
import "../../assets/styles/write-module.css";
import { BottonAudioComponent } from "../../components/games/CardComponent";
import DragComponent from "../../components/shared/DragComponent";
import { useDragPosition } from "../../hooks/useDragPosition";
import { GameContext } from "../../context/GameContext";
import { mockWriteData } from "../../utils/mockData/modWrite";
import { useDimesions, useSetScrollPosition } from "../../hooks/useDimesion";
import { useResponseAudio } from "../../hooks/usePlaySounds";
import WrittingInstructions from "../../components/games/WrittingModule/WrittingInstructions";

// Importación para progreso automático - Sistema Local
import { useLocalGameProgress } from "../../hooks/useLocalGameProgress";

// 🎮 Importaciones para Gamificación
import GamificationFeedback from "../../components/games/GamificationFeedback";
import { useGamificationFeedback } from "../../hooks/useGamificationFeedback";

const WrittingScreen = () => {
  useSetBackGround(backGround);
  useSetScrollPosition();

  const { idLetter } = useParams();

  const [isInPosition] = useDragPosition();
  const dimesion = useDimesions();
  const { dispatch } = useContext(GameContext);
  const history = useHistory();
  const [playResponseAudio] = useResponseAudio();
  const [transition, setTransition] = useState(false);
  const [state, setState] = useState(initialState(idLetter));

  // Hook para progreso automático - Sistema Local
  const {
    updateScore,
    markAsCompleted
  } = useLocalGameProgress('writing-game', idLetter);

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

  // 🔄 Reiniciar puntos al iniciar el juego
  useEffect(() => {
    dispatch({ type: "RESET_POINTS" });
  }, []);

  useEffect(() => {
    if (transition) {
      let tl = gsap.timeline();
      tl.from(".wrContainerBox", {
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
    document.body.style.minHeight = "900px";
  }, []);

  const dragEndState = (
    dragItem,
    container,
    dispatchDrag,
    setTranslate,
    stateDrag
  ) => {
    let timer;
    if (!stateDrag.lockResponse) {
      const list = document.querySelectorAll(".itemContainer");
      const node = Object.values(list).reduce((prev, item) => {
        if (isInPosition(item, dragItem)) return item;
        return prev;
      }, null);
      if (node && node.dataset.word && node.dataset.locked === "false") {
        let { left, top } = container.getBoundingClientRect();
        let { x, y } = node.getBoundingClientRect();
        let positionX = x - left - (dimesion.width <= 425 ? 5 : 10);
        let positionY = y - top;

        let response = node.dataset.word;
        let option = dragItem.dataset.word;
        clearTimeout(timer);

        setTranslate(positionX, positionY, dragItem);
        dispatchDrag({
          type: "SET_DRAG_POSITION",
          data: {
            initialY: positionY,
            yOffset: positionY,
            currentY: positionY,
            initialX: positionX,
            xOffset: positionX,
            currentX: positionX,
          },
        });
        playResponseAudio(response === option);

        if (response === option) {
          // 📊 Actualizar contador de intentos correctos
          setCorrectAttempts(prev => prev + 1);
          
          let numLetters = state.numLetters - 1;
          let index = node.dataset.position;
          let current = { ...state.current };
          dragItem.classList.add("wrLetterGood");
          dispatch({
            type: "ADD_POINTS",
            value: 1,
          });
          dispatchDrag({
            type: "LOCK_RESPONSE",
            data: {},
          });

          // Delay acelerado antes de avanzar
          setTimeout(() => {
            if (numLetters > 0) {
              current.spell[index].locked = true;
              setState({
                ...state,
                numLetters,
                current,
              });
            } else if (state.position + 1 < state.words.length) {
              // Palabra completada - guardar progreso incremental
              const wordsCompleted = state.position + 1;
              const progressScore = wordsCompleted * 80; // 80 puntos por palabra completada
              
              try {
                updateScore(progressScore, {
                  wordsCompleted,
                  totalWords: state.words.length,
                  currentPosition: state.position + 1,
                  level: idLetter
                });
                console.log(`✏️ Escritura - Palabra ${wordsCompleted} completada! Score:`, progressScore);
              } catch (error) {
                console.log('Error guardando progreso incremental escritura:', error);
              }

              let position = state.position + 1;
              let [options, numLetters] = createOptions(
                state.words[position].name.toLowerCase(),
                idLetter
              );
              setState({
                ...state,
                options,
                current: setResponse(state.words[position]),
                position,
                numLetters,
              });
              setTransition(true);
            } else {
              // Juego completado - guardar progreso final
              const finalScore = state.words.length * 80; // Score final
              
              // 📊 Calcular accuracy y estrellas
              const totalAttempts = correctAttempts + incorrectAttempts;
              const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 100;
              
              // Determinar estrellas basadas en accuracy
              let stars = 0;
              if (accuracy >= 90) stars = 3;
              else if (accuracy >= 70) stars = 2;
              else if (accuracy >= 50) stars = 1;
              
              try {
                markAsCompleted(finalScore, {
                  wordsCompleted: state.words.length,
                  totalWords: state.words.length,
                  level: idLetter,
                  completed: true,
                  gameType: 'writing',
                  accuracy: Math.round(accuracy),
                  stars,
                  correctAttempts,
                  incorrectAttempts
                });
                console.log('✏️ Escritura completada! Score:', finalScore, 'Accuracy:', accuracy.toFixed(1) + '%', 'Estrellas:', stars);
              } catch (error) {
                console.log('Error guardando progreso final escritura:', error);
              }

              // 🎮 Mostrar feedback gamificado con estrellas
              const motivationalMessage = stars >= 3 ? '¡Perfecto! ¡Excelente trabajo! 🎉👏' :
                                           stars >= 2 ? '¡Muy bien! ¡Sigue así! 😊⭐' :
                                           stars >= 1 ? '¡Buen intento! ¡Puedes mejorar! 💪' :
                                           '¡No te rindas! ¡Inténtalo de nuevo! 🎓';
              triggerFeedback(accuracy, motivationalMessage);

              setTimeout(() => {
                history.push("/level-up", { 
                  gameUrl: `/escritura/${idLetter}`,
                  accuracy: Math.round(accuracy)
                });
              }, 3500);
            }
          }, 1000);
        } else {
          // 📊 Actualizar contador de intentos incorrectos
          setIncorrectAttempts(prev => prev + 1);
          
          dragItem.classList.add("wrLetterBad");
          setTimeout(function () {
            gsap.fromTo(
              dragItem,
              { x: positionX, y: positionY },
              {
                x: 0,
                y: 0,
                duration: 0.3,
                onComplete: function () {
                  dragItem.classList.remove("wrLetterBad");
                  dispatchDrag({
                    type: "WRONG_ANSWER",
                    data: {
                      actualX: null,
                      actualY: null,
                    },
                  });
                  dispatch({
                    type: "ADD_POINTS",
                    value: -1,
                  });
                },
              }
            );
          }, 800);
        }
        return;
      }
      timer = setTimeout(() => {
        gsap.fromTo(
          dragItem,
          { x: stateDrag.currentX, y: stateDrag.currentY },
          {
            x: 0,
            y: 0,
            duration: 0.3,
            onComplete: function () {
              dispatchDrag({
                type: "WRONG_ANSWER",
                data: {
                  actualX: null,
                  actualY: null,
                },
              });
            },
          }
        );
      }, 300);
    }
  };

  return (
    <div
      className="containerGame"
      style={transition ? { overflowX: "hidden" } : {}}
    >
      <Header></Header>
      <TitleSound
        title="Completa la palabra"
        titleSound={instructions}
        listAudio={[instructions]}
        ModalChild={WrittingInstructions}
        module="writting"
      />
      <div className="wrContainerBox">
        <div className="containerLetters">
          {/* section letters */}
          {state.current.spell.map((letter, index) => (
            <div
              data-word={letter.name === state.response ? letter.name : ""}
              data-locked={letter.locked}
              data-position={index}
              className={`itemResponse itemContainer ${
                letter.name === state.response ? "" : "wrLetterGood"
              }`}
              key={index}
            >
              <p>{letter.name === state.response ? "" : letter.name}</p>
            </div>
          ))}
        </div>
        <div className="wrContainerOptions">
          {/* section image a vocals */}
          <div className="wrContainerImage">
            <div className="cardImage wrCardImage">
              <img
                className="imageCard"
                src={state.current.image}
                alt={state.current.name}
              />
            </div>
            <BottonAudioComponent
              styles="wrButtonAudio"
              audio={state.current.sound}
            />
          </div>
          <div className="wrContainerResponse">
            {state.options.map((item, index) => (
              <div className="wrRowItems" key={index}>
                {item.map((it, index) => (
                  <DragComponent
                    key={it.id}
                    styles={{
                      dragItem: "itemResponse itemLetter",
                      container: `dragContainer`,
                    }}
                    dragEndState={dragEndState}
                    response={it.name}
                  >
                    <p>{it.name}</p>
                  </DragComponent>
                ))}
              </div>
            ))}
          </div>
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

function createOptions(word, letter) {
  let vocals = ["a", "e", "i", "o", "u"];
  let index = vocals.indexOf(letter);
  let row = word.length <= 4 ? 2 : 3;
  let numLetters = word
    .split("")
    .reduce((prev, item) => (item === letter ? prev + 1 : prev), 0);
  let list = [];

  vocals.splice(index, 1);
  let options = word
    .split("")
    .map((item) =>
      item === letter ? item : vocals[Math.floor(Math.random() * vocals.length)]
    )
    .reduce((prev, item, index) => {
      list.push({
        name: item,
        id: Math.floor(Math.random() * new Date().getTime()),
      });
      if ((index + 1) % row === 0 || index + 1 === word.length) {
        prev.push(list);
        list = [];
      }
      return prev;
    }, []);
  return [options, numLetters];
}

function setResponse(word) {
  let response = word.name
    .toLowerCase()
    .split("")
    .map((item, index) => ({
      name: item,
      locked: false,
    }));

  return { ...word, spell: response };
}

function initialState(letter) {
  const data = mockWriteData(letter);
  let [options, numLetters] = createOptions(data[0].name.toLowerCase(), letter);
  return {
    words: data,
    options: options,
    current: setResponse(data[0]),
    position: 0,
    numLetters: numLetters,
    response: letter,
  };
}

export default WrittingScreen;
