import React, { useRef, useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import gsap from "gsap";

import { iconSoundWhite } from "../../utils/imagesResources";
import titleSound from "../../assets/sounds/moduloVocabulario.mp3";
import reviewTitleSound from "../../assets/sounds/repasemos_vocabulario.mp3";

import DragComponent from "../../components/games/DragComponent";
import ResponseComponent from "../../components/games/ResponseComponent";

import Header from "../../components/shared/Header";
import { getData, getReviewData } from "../../utils/mockData/modVocabulario";
import "../../assets/styles/games.css";
import "../../assets/styles/main.css";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import backGround from "../../assets/images/background_tramas.svg";
import TitleSound from "../../components/shared/TitleSound";
import AutoFitText from "../../components/shared/AutoFitText";
import { usePlaySounds } from "../../hooks/usePlaySounds";
import VocalIntructions from "../../components/games/VocalModule/VocalIntructions";
import { useSetScrollPosition } from "../../hooks/useDimesion";
import { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import botonNext from "../../assets/images/botonNext.svg";
import {
  enunciadoSigueAsi,
  enunciadoExcelente,
  enunciadoVasMuyBien,
  enunciadoEsaNoEs,
  enunciadoTuPuedes,
  enunciadoConfioEnTi,
  enunciadoIntentaloDeNuevo,
  enunciadoTranquiloPuedesVolverAIntentarlo,
  enunciadoEresUnCampeon,
  enunciadoLoEstasHaciendoExcelente,
  enunciadoMuyBienLoLograste,
  enunciadoUnPasoALaVez,
  enunciadoEsfuerzateUnPocoMas,
  enunciadoAdelanteTuPuedes,
} from "../../utils/sounds";

// Importación para progreso automático - Sistema Local
import { useLocalGameProgress } from "../../hooks/useLocalGameProgress";

// 🎮 Importaciones para Gamificación
import GamificationFeedback from "../../components/games/GamificationFeedback";
import { useGamificationFeedback } from "../../hooks/useGamificationFeedback";

const Games = () => {
  let history = useHistory();
  useSetBackGround(backGround);
  useSetScrollPosition();
  const { idLetter } = useParams();
  const { dispatch } = useContext(GameContext);

  const [position, setPosition] = useState(0);
  const [statusWord, setStatusWord] = useState({
    word1: false,
    word2: false,
  });
  const [transition, setTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  // Repaso previo (por ahora solo vocal 'a')
  const [phase, setPhase] = useState("review"); // review | game
  const [reviewItems, setReviewItems] = useState([]);
  // Marca solo cuando el niño presiona para reproducir (para UI del icono)
  const [reviewManualPlayedMap, setReviewManualPlayedMap] = useState({});
  const [reviewIndex, setReviewIndex] = useState(0);
  const lastAutoPlayedReviewIdRef = useRef(null);
  const reviewAutoPlayTimeoutRef = useRef(null);
  // El render de la palabra actual depende solo de position y list
  const boxResponse1 = useRef(null);
  const boxResponse2 = useRef(null);

  const [playSound, getCurrentAudio, stopSound] = usePlaySounds();
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);

  const dragRefs = useRef([]);

  // Hook para progreso automático - Sistema Local
  const {
    updateScore,
    markAsCompleted
  } = useLocalGameProgress('vocabulary-game', idLetter);

  // 🎮 Hook para gamificación
  const {
    showFeedback,
    performance,
    customMessage,
    showSimpleFeedback,
    hideFeedback,
    getStarCount
  } = useGamificationFeedback();

  // 🎮 Contador de pares completados con éxito
  const [completedPairs, setCompletedPairs] = useState(0);
  // 🎮 Flag para evitar procesamiento múltiple
  const [isProcessing, setIsProcessing] = useState(false);
  // 📊 Tracking de desempeño
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);


  // 🎧 Enunciados (todas las vocales)
  const midGoodPlayedRef = useRef(0);
  const midBadPlayedRef = useRef(0);
  const lastEnunciadoAtRef = useRef(0);
  const pendingEnunciadoTimeoutRef = useRef(null);

  const isVowel = ["a", "e", "i", "o", "u"].includes((idLetter || "").toLowerCase());

  const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

  const isAnyAudioPlaying = () => {
    const aud = getCurrentAudio ? getCurrentAudio() : null;
    if (!aud) return false;
    try {
      return !aud.paused;
    } catch (e) {
      return false;
    }
  };

  const playEnunciado = (audioOrSequence) => {
    if (!isVowel) return;
    if (phase !== "game") return;
    if (isAnyAudioPlaying()) return;

    // No cortar otros sonidos: solo reproducir si no hay audio activo
    if (Array.isArray(audioOrSequence) && audioOrSequence.length === 2) {
      stopSound();
      playSound(audioOrSequence[0], {
        onEnded: () => {
          playSound(audioOrSequence[1]);
        },
      });
      return;
    }
    stopSound();
    playSound(audioOrSequence);
  };

  const tryPlayEnunciado = (audioOrSequence, onPlayed) => {
    if (!isVowel) return false;
    if (phase !== "game") return false;

    const playNow = () => {
      if (isAnyAudioPlaying()) return false;
      playEnunciado(audioOrSequence);
      if (typeof onPlayed === "function") onPlayed();
      return true;
    };

    if (playNow()) return true;

    // Si hay otro audio sonando (palabra/feedback), reintentar una sola vez.
    if (pendingEnunciadoTimeoutRef.current) return false;
    pendingEnunciadoTimeoutRef.current = setTimeout(() => {
      pendingEnunciadoTimeoutRef.current = null;
      playNow();
    }, 850);
    return false;
  };

  const playFinalEnunciado = (audioOrSequence, onDone) => {
    if (!isVowel) {
      if (typeof onDone === "function") onDone();
      return;
    }

    // Final de actividad: forzar reproducción (puede cortar otros audios)
    stopSound();

    const done = () => {
      if (typeof onDone === "function") onDone();
    };

    if (Array.isArray(audioOrSequence) && audioOrSequence.length === 2) {
      playSound(audioOrSequence[0], {
        onEnded: () => {
          playSound(audioOrSequence[1], {
            onEnded: done,
            onError: done,
          });
        },
        onError: () => {
          playSound(audioOrSequence[1], {
            onEnded: done,
            onError: done,
          });
        },
      });
      return;
    }

    playSound(audioOrSequence, {
      onEnded: done,
      onError: done,
    });
  };

  // 🔄 Reiniciar puntos al iniciar el juego
  useEffect(() => {
    dispatch({ type: "RESET_POINTS" });
  }, []);

  // Reset de enunciados al entrar/cambiar letra
  useEffect(() => {
    midGoodPlayedRef.current = 0;
    midBadPlayedRef.current = 0;
    lastEnunciadoAtRef.current = 0;
    if (pendingEnunciadoTimeoutRef.current) {
      clearTimeout(pendingEnunciadoTimeoutRef.current);
      pendingEnunciadoTimeoutRef.current = null;
    }
  }, [idLetter]);

  // Enunciados durante la actividad (limitados y aleatorios)
  useEffect(() => {
    if (!isVowel) return;
    if (phase !== "game") return;
    if (!isLoading) return;

    const now = Date.now();
    const cooldownMs = 6500;
    if (now - lastEnunciadoAtRef.current < cooldownMs) return;

    // Si se equivocó: hasta 3 enunciados máximo
    if (incorrectAttempts > 0) {
      const canPlay = midBadPlayedRef.current < 3;
      if (!canPlay) return;

      // Asegurar que al menos 1 salga: el primer error lo dispara (si el cooldown lo permite)
      const chance = incorrectAttempts === 1 && midBadPlayedRef.current === 0 ? 1 : 0.45;
      if (Math.random() < chance) {
        const midBad = [
          enunciadoEsaNoEs,
          enunciadoTuPuedes,
          enunciadoConfioEnTi,
          enunciadoIntentaloDeNuevo,
        ];
        const pick = pickRandom(midBad);
        tryPlayEnunciado(pick, () => {
          midBadPlayedRef.current += 1;
          lastEnunciadoAtRef.current = Date.now();
        });
      }
    }
  }, [incorrectAttempts, isVowel, phase, isLoading]);

  useEffect(() => {
    if (!isVowel) return;
    if (phase !== "game") return;
    if (!isLoading) return;

    const now = Date.now();
    const cooldownMs = 9000;
    if (now - lastEnunciadoAtRef.current < cooldownMs) return;

    // Va bien: 1-2 enunciados máximo
    const isDoingWell = incorrectAttempts <= 1;
    if (!isDoingWell) return;
    if (completedPairs <= 0) return;
    if (midGoodPlayedRef.current >= 2) return;

    // Asegurar que al menos 1 salga si va bien: tras el primer par completado
    const chance = completedPairs === 1 && midGoodPlayedRef.current === 0 && incorrectAttempts === 0 ? 1 : 0.28;
    if (Math.random() < chance) {
      const midGood = [enunciadoSigueAsi, enunciadoExcelente, enunciadoVasMuyBien];
      const pick = pickRandom(midGood);
      tryPlayEnunciado(pick, () => {
        midGoodPlayedRef.current += 1;
        lastEnunciadoAtRef.current = Date.now();
      });
    }
  }, [completedPairs, incorrectAttempts, isVowel, phase, isLoading]);

  useEffect(() => {
    // Verificar que ambas palabras estén completas y no estemos procesando
    if (statusWord.word1 && statusWord.word2 && !isProcessing) {
      setIsProcessing(true); // Bloquear procesamiento múltiple
      
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
      
      if (position + 1 < list.length) {
        // Avanzar a siguiente par directamente (sin estrellas intermedias)
        setTimeout(() => {
          // Resetear los drags
          dragRefs.current.forEach(ref => {
            if (ref && ref.resetDrag) ref.resetDrag();
          });
          
          // Avanzar a la siguiente posición
          setPosition(position + 1);
          setStatusWord({
            word1: false,
            word2: false,
          });
          setTransition(true);
          setCompletedPairs(prev => prev + 1);
          setIsProcessing(false); // Desbloquear para el siguiente par
        }, 500); // Pequeña pausa antes de avanzar
      } else {
        // 🎮 Juego completado - Calcular desempeño y mostrar feedback
        const finalPairs = list.length;
        
        // Cada par tiene 2 palabras, y cada palabra correcta cuenta como 1 acierto
        const mandatoryCorrect = finalPairs * 2; // Los pares correctos que deben completarse
        const totalCorrect = correctAttempts + mandatoryCorrect;
        const totalAttempts = totalCorrect + incorrectAttempts;
        const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 100;
        
        // Calcular estrellas según accuracy
        let stars = 0;
        let performanceMsg = '';
        if (accuracy >= 90) {
          stars = 3;
          performanceMsg = '¡Excelente! ¡Perfecto! 🌟🌟🌟';
        } else if (accuracy >= 70) {
          stars = 2;
          performanceMsg = '¡Muy bien! ¡Sigue así! 🌟🌟';
        } else if (accuracy >= 50) {
          stars = 1;
          performanceMsg = '¡Buen intento! ¡Puedes mejorar! 🌟';
        } else {
          stars = 0;
          performanceMsg = '¡Sigue practicando! 💪';
        }
        
        const finalScore = list.length * 100;

        // 🎧 Enunciado final (todas las vocales) según desempeño
        let finalPick;
        if (isVowel) {
          if (incorrectAttempts === 0) {
            // TODO BIEN
            finalPick = pickRandom([
              enunciadoEresUnCampeon,
              enunciadoLoEstasHaciendoExcelente,
              enunciadoMuyBienLoLograste,
            ]);
          } else if (incorrectAttempts <= 5) {
            // Se equivoca algunas veces
            finalPick = pickRandom([
              enunciadoUnPasoALaVez,
              enunciadoEsfuerzateUnPocoMas,
              enunciadoAdelanteTuPuedes,
            ]);
          } else {
            // Cuando debe repetirlo
            finalPick = pickRandom([
              [enunciadoTuPuedes, enunciadoIntentaloDeNuevo],
              enunciadoTranquiloPuedesVolverAIntentarlo,
              enunciadoEsfuerzateUnPocoMas,
            ]);
          }
        }
        
        try {
          markAsCompleted(finalScore, {
            wordsCompleted: list.length,
            totalWords: list.length,
            level: idLetter,
            completed: true,
            gameType: 'vocabulary',
            correctAttempts: totalCorrect,
            incorrectAttempts,
            accuracy: Math.round(accuracy),
            stars
          });
          console.log('🎉 Vocabulario completado!', {
            score: finalScore,
            accuracy: `${Math.round(accuracy)}%`,
            stars,
            correctas: totalCorrect,
            incorrectas: incorrectAttempts
          });
        } catch (error) {
          console.log('Error guardando progreso final:', error);
        }

        // Mostrar feedback con mensaje según desempeño
        showSimpleFeedback(accuracy, 100, performanceMsg);

        // Redirigir después del feedback
        if (isVowel && finalPick) {
          let navigated = false;
          const go = () => {
            if (navigated) return;
            navigated = true;
            history.push("/level-up", {
              gameUrl: `/vocabulario/${idLetter}`,
              accuracy: Math.round(accuracy),
            });
          };

          // Esperar a que termine el enunciado final (con fallback)
          playFinalEnunciado(finalPick, go);
          setTimeout(go, 6500);
        } else {
          setTimeout(() => {
            history.push("/level-up", {
              gameUrl: `/vocabulario/${idLetter}`,
              accuracy: Math.round(accuracy),
            });
          }, 3500);
        }
      }
    }
  }, [statusWord, position, history, list, idLetter, updateScore, markAsCompleted, showSimpleFeedback, isProcessing]);

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
    setCompletedPairs(0); // 🎮 Resetear contador al cambiar de nivel
    setIsProcessing(false); // 🎮 Resetear flag de procesamiento

    const lower = (idLetter || "").toLowerCase();
    const isVowel = ["a", "e", "i", "o", "u"].includes(lower);
    if (isVowel) {
      const nextReviewItems = getReviewData(idLetter, 5);
      setReviewItems(nextReviewItems);
      setReviewManualPlayedMap({});
      setReviewIndex(0);
      lastAutoPlayedReviewIdRef.current = null;
      if (reviewAutoPlayTimeoutRef.current) {
        clearTimeout(reviewAutoPlayTimeoutRef.current);
        reviewAutoPlayTimeoutRef.current = null;
      }
      // Si no hay data de repaso para esta vocal, saltar directo al juego
      setPhase(nextReviewItems.length ? "review" : "game");
    } else {
      setPhase("game");
      setReviewItems([]);
      setReviewManualPlayedMap({});
      setReviewIndex(0);
      lastAutoPlayedReviewIdRef.current = null;
      if (reviewAutoPlayTimeoutRef.current) {
        clearTimeout(reviewAutoPlayTimeoutRef.current);
        reviewAutoPlayTimeoutRef.current = null;
      }
    }
  }, [idLetter]);

  const handleReviewPlay = useCallback(
    (item, options = {}) => {
      if (!item) return;
      const { markManual = true } = options;

      // Si es auto-play, verificar si ya hay audio reproduciéndose
      if (!markManual) {
        const currentAud = getCurrentAudio ? getCurrentAudio() : null;
        if (currentAud && !currentAud.paused) {
          return;
        }
      }

      stopSound();
      playSound(item.sound);

      // Solo cambiar el icono a "repetir" cuando el niño presiona
      if (markManual) {
        setReviewManualPlayedMap((prev) => ({
          ...prev,
          [item.id]: true,
        }));
      }
    },
    [playSound, stopSound, getCurrentAudio]
  );

  const currentReviewItem =
    phase === "review" && reviewItems.length ? reviewItems[reviewIndex] : null;

  // 🔇 Al cambiar de tarjeta en el repaso, cortar audio anterior y cancelar auto-play pendiente
  useEffect(() => {
    if (phase !== "review") return;

    stopSound();
    if (reviewAutoPlayTimeoutRef.current) {
      clearTimeout(reviewAutoPlayTimeoutRef.current);
      reviewAutoPlayTimeoutRef.current = null;
    }

    return () => {
      // Si salimos del repaso, asegurar que no quede audio/timeout vivo
      stopSound();
      if (reviewAutoPlayTimeoutRef.current) {
        clearTimeout(reviewAutoPlayTimeoutRef.current);
        reviewAutoPlayTimeoutRef.current = null;
      }
    };
  }, [phase, reviewIndex, stopSound]);

  // 🔊 Auto reproducir el audio al entrar cada tarjeta del repaso (1 por pantalla)
  useEffect(() => {
    if (phase !== "review") return;
    if (!currentReviewItem) return;

    if (reviewAutoPlayTimeoutRef.current) {
      clearTimeout(reviewAutoPlayTimeoutRef.current);
      reviewAutoPlayTimeoutRef.current = null;
    }

    // Evitar doble reproducción en dev (StrictMode) para el mismo id
    if (lastAutoPlayedReviewIdRef.current === currentReviewItem.id) return;
    lastAutoPlayedReviewIdRef.current = currentReviewItem.id;

    // Dar un poco más de delay SOLO en la primera carta
    const delayMs = reviewIndex === 0 ? 1200 : 280;
    reviewAutoPlayTimeoutRef.current = setTimeout(() => {
      reviewAutoPlayTimeoutRef.current = null;
      handleReviewPlay(currentReviewItem, { markManual: false });
    }, delayMs);

    return () => {
      if (reviewAutoPlayTimeoutRef.current) {
        clearTimeout(reviewAutoPlayTimeoutRef.current);
        reviewAutoPlayTimeoutRef.current = null;
      }
    };
  }, [phase, reviewIndex, currentReviewItem, handleReviewPlay]);

  const goNextReview = () => {
    if (!reviewItems.length) return;

    // Cortar audio actual y evitar que se dispare auto-play viejo
    stopSound();
    if (reviewAutoPlayTimeoutRef.current) {
      clearTimeout(reviewAutoPlayTimeoutRef.current);
      reviewAutoPlayTimeoutRef.current = null;
    }

    if (reviewIndex < reviewItems.length - 1) {
      setReviewIndex((prev) => prev + 1);
      return;
    }

    // Al finalizar el repaso, iniciar el juego
    stopSound();
    setPhase("game");
  };

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

  if (!isLoading) return <div></div>;

  const current = list[position];

  return (
    <div
      className="containerGame"
      style={transition ? { overflowX: "hidden" } : {}}
    >
      <Header></Header>
      {phase === "review" ? (
        <>
          <TitleSound
            title="Repasa estas 5 palabras antes de jugar"
            titleSound={reviewTitleSound}
            listAudio={[reviewTitleSound]}
            module="vocabulary-review"
            disableSound={false}
            showFinger={reviewIndex === 0}
            fingerPlaysAudio={false}
            autoHideFingerAfterMs={1800}
          />
          <div className="vocabReviewStage">
            {!currentReviewItem ? (
              <div></div>
            ) : (
              <div
                key={currentReviewItem.id}
                className="vocabReviewCard vocabReviewCard--enter"
              >
                <div
                  className="cardImage"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleReviewPlay(currentReviewItem, { markManual: true })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleReviewPlay(currentReviewItem, { markManual: true });
                  }}
                  aria-label={`Reproducir ${currentReviewItem.name}`}
                >
                  <img
                    className="imageCard"
                    src={currentReviewItem.image}
                    alt={currentReviewItem.name}
                  />
                </div>

                <div className="boxWords">
                  <button
                    onClick={() => handleReviewPlay(currentReviewItem, { markManual: true })}
                    className="Buttongame"
                    aria-label={
                      reviewManualPlayedMap[currentReviewItem.id]
                        ? `Repetir ${currentReviewItem.name}`
                        : `Escuchar ${currentReviewItem.name}`
                    }
                    type="button"
                  >
                    {reviewManualPlayedMap[currentReviewItem.id] ? (
                      <span className="vocabRepeatGlyph" aria-hidden="true">
                        ↻
                      </span>
                    ) : (
                      <img src={iconSoundWhite} alt="iconSound" />
                    )}
                  </button>
                  <AutoFitText
                    as="h3"
                    text={currentReviewItem.name}
                    maxPx={36}
                    minPx={18}
                    allowWrapFallback={true}
                    style={{ flex: 1, minWidth: 0 }}
                  />
                </div>

                <div className="vocabReviewNav">
                  <button
                    type="button"
                    className="vocabNextButton"
                    onClick={goNextReview}
                    aria-label={
                      reviewIndex < reviewItems.length - 1
                        ? "Siguiente palabra"
                        : "Empezar juego"
                    }
                  >
                    <img
                      className="vocabNextIcon"
                      src={botonNext}
                      alt="Siguiente"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {!current ? (
            <div></div>
          ) : (
            <>
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
                    ref={(el) => (dragRefs.current[0] = el)}
                    word={current.word2.name}
                    divResponse={[boxResponse1, boxResponse2]}
                    setStatusWord={setStatusWord}
                    statusWord={statusWord}
                    onCorrectAttempt={() => setCorrectAttempts((prev) => prev + 1)}
                    onIncorrectAttempt={() =>
                      setIncorrectAttempts((prev) => prev + 1)
                    }
                  >
                    <button
                      onClick={() => on()}
                      disabled={state}
                      className="Buttongame"
                    >
                      <img src={iconSoundWhite} alt="iconSound" />
                    </button>
                    <AutoFitText
                      as="h3"
                      text={current.word2.name}
                      maxPx={40}
                      minPx={24}
                      allowWrapFallback={false}
                    />
                  </DragComponent>
                  <DragComponent
                    ref={(el) => (dragRefs.current[1] = el)}
                    word={current.word1.name}
                    divResponse={[boxResponse1, boxResponse2]}
                    setStatusWord={setStatusWord}
                    statusWord={statusWord}
                    onCorrectAttempt={() => setCorrectAttempts((prev) => prev + 1)}
                    onIncorrectAttempt={() =>
                      setIncorrectAttempts((prev) => prev + 1)
                    }
                  >
                    <button
                      onClick={() => un()}
                      disabled={state2}
                      className="Buttongame"
                    >
                      <img src={iconSoundWhite} alt="iconSound" />
                    </button>
                    <AutoFitText
                      as="h3"
                      text={current.word1.name}
                      maxPx={40}
                      minPx={24}
                      allowWrapFallback={false}
                    />
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
            </>
          )}
        </>
      )}

      {/* 🎮 Componente de Gamificación */}
      
      {/* Feedback completo al finalizar el juego (con estrellas integradas) */}
      <GamificationFeedback
        show={showFeedback}
        performance={performance}
        customMessage={customMessage}
        onComplete={hideFeedback}
      />
    </div>
  );
};

export default Games;
