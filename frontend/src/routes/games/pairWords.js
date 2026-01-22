import React, { useContext, useEffect, useState, useMemo } from "react";
import { useHistory, useParams } from "react-router";

import background from "../../assets/images/fondoModPares.svg";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import audioTitle from "../../assets/sounds/intructions/modArmarPares.mp3";
import { getModuleData } from "../../utils/mockData/modPairs";
import { GameContext } from "../../context/GameContext";
import { useResponseAudio } from "../../hooks/usePlaySounds";

import cover from "../../assets/images/cuadroMorado.svg";
import "../../assets/styles/pair-module.css";
import "../../assets/styles/pair-module-responsive-v2.css";
import Header from "../../components/shared/Header";
import TitleSound from "../../components/shared/TitleSound";
import PairInstructions from "../../components/games/PairModule/PairInstructions";
import { useSetScrollPosition } from "../../hooks/useDimesion";

// Importaciones para sistema responsivo
import { useDeviceDetection, useDevicePairConfig } from "../../hooks/useDeviceDetection";
import gameConfigService from "../../services/gameConfigService";

// Importación para progreso automático - SISTEMA LOCAL
import { useLocalGameProgress } from "../../hooks/useLocalGameProgress";

// 🎮 Importaciones para Gamificación
import GamificationFeedback from "../../components/games/GamificationFeedback";
import { useGamificationFeedback } from "../../hooks/useGamificationFeedback";

const PairWords = () => {
  useSetBackGround(background);
  useSetScrollPosition();

  const { idLetter } = useParams();
  const { dispatch } = useContext(GameContext);
  
  // Detectar dispositivo
  const deviceDetection = useDeviceDetection();
  const [gameConfig, setGameConfig] = useState(null);
  
  // 🔒 Configuración FIJA - se establece UNA SOLA VEZ cuando screenWidth > 0
  const [fixedConfig, setFixedConfig] = useState(null);
  
  // Calcular config basada en ancho de pantalla
  const getConfigFromWidth = (width) => {
    // Obtener configuración personalizada si existe
    const savedConfig = gameConfigService.getLocalConfig('pair-words');
    const totalPairs = savedConfig.totalPairs || 4; // Usar configuración guardada o 4 por defecto
    
    if (width < 768) {
      return {
        pairsPerRow: 2,
        totalPairs: Math.max(2, Math.min(totalPairs, 6)), // En móvil máximo 6 pares
        cardSize: 'small',
        deviceType: 'mobile'
      };
    } else if (width >= 768 && width < 1024) {
      return {
        pairsPerRow: 4,
        totalPairs: Math.max(2, Math.min(totalPairs, 8)), // En tablet máximo 8 pares
        cardSize: 'medium',
        deviceType: 'tablet'
      };
    } else {
      return {
        pairsPerRow: 4,
        totalPairs: Math.max(2, totalPairs), // En desktop sin límite pero mínimo 2
        cardSize: 'large',
        deviceType: 'desktop'
      };
    }
  };
  
  // Establecer config fija cuando el ancho es válido
  useEffect(() => {
    // Solo establecer si no existe Y el ancho es válido
    if (!fixedConfig && deviceDetection.screenWidth > 0) {
      const config = getConfigFromWidth(deviceDetection.screenWidth);
      console.log('🔒 FIJANDO configuración - Ancho:', deviceDetection.screenWidth, 'Config:', config);
      setFixedConfig(config);
    }
  }, [deviceDetection.screenWidth, fixedConfig]);
  
  // Escuchar cambios en la configuración
  useEffect(() => {
    const handleConfigChange = (event) => {
      console.log('🔄 Configuración de pares cambió:', event.detail);
      // Recargar configuración
      if (deviceDetection.screenWidth > 0) {
        const newConfig = getConfigFromWidth(deviceDetection.screenWidth);
        setFixedConfig(newConfig);
        // Reiniciar el juego con la nueva configuración
        setState({ loading: true, cards: [], correct: 0, open: 0 });
      }
    };
    
    window.addEventListener('pairGameConfigChanged', handleConfigChange);
    
    return () => {
      window.removeEventListener('pairGameConfigChanged', handleConfigChange);
    };
  }, [deviceDetection.screenWidth]);
  
  // Estado del juego
  const [state, setState] = useState(() => {
    return { loading: true, cards: [], correct: 0, open: 0 };
  });
  const history = useHistory();
  const [playResponseAudio] = useResponseAudio();
  
  // Hook para progreso automático - SISTEMA LOCAL
  const {
    updateScore,
    markAsCompleted
  } = useLocalGameProgress('pair-words', idLetter);

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

  const compareWords = (word1, word2) => {
    return word1.toLowerCase() === word2.toLowerCase();
  };

  const checkWords = () => {
    const { cards } = state;
    const list = cards.reduce((prev, item) => {
      if (item.show && !item.check) prev.push(item);
      return prev;
    }, []);
    if (list.length < 2) return;
    let isCorrect = compareWords(list[0].name, list[1].name);

    // 📊 Actualizar contadores de accuracy
    if (isCorrect) {
      setCorrectAttempts(prev => prev + 1);
    } else {
      setIncorrectAttempts(prev => prev + 1);
    }

    playResponseAudio(isCorrect);
    dispatch({
      type: "ADD_POINTS",
      value: isCorrect ? 3 : -1,
    });

    // Guardar progreso automáticamente cuando se encuentra un par correcto
    if (isCorrect) {
      const pairScore = 100; // Puntos por par encontrado
      const timeBonus = 10; // Bonus fijo por ahora
      const totalScore = pairScore + timeBonus;
      const totalPairs = fixedConfig.totalPairs;
      
      // 🎯 CORREGIR: Calcular pares encontrados correctamente
      // Si correct inicia en 8 y baja a 7, significa que encontramos 1 par (8-7=1)
      const pairsFound = totalPairs - (state.correct - 1);
      
      try {
        // Actualizar score con el nuevo sistema local
        updateScore(pairsFound * 100, {
          pairsFound,
          totalPairs: totalPairs,
          currentScore: pairsFound * 100,
          level: idLetter
        });
        
        console.log('Par correcto encontrado! Score:', totalScore, 'Pares encontrados:', pairsFound);
      } catch (error) {
        console.log('Progress save failed, but continuing game:', error);
      }
    }

    // Delay de 1 segundo antes de avanzar
    setTimeout(() => {
      if (isCorrect) {
        list[0].check = true;
        list[1].check = true;
      }
      const newCorrectCount = isCorrect ? state.correct - 1 : state.correct;
      
      console.log('📊 Actualizando estado - Pares restantes:', newCorrectCount);
      
      const cardState = {
        ...state,
        open: 0,
        correct: newCorrectCount,
        cards: isCorrect
          ? [...cards]
          : state.cards.map((item) => ({ ...item, show: false })),
      };
      setState(cardState);
      
      // Verificar si el juego terminó
      if (newCorrectCount === 0) {
        console.log('🎉 ¡JUEGO COMPLETADO! Todos los pares encontrados');
      }
    }, 1000);
  };

  const selectCard = (index) => {
    let { cards, open } = state;
    if (open <= 1 && !cards[index].show) {
      cards[index].show = true;
      setState({ ...state, open: state.open + 1, cards });
      if (open === 1) checkWords();
      return;
    }
  };

  // Cargar configuración del juego con fallback local
  useEffect(() => {
    const loadGameConfig = async () => {
      try {
        // Usar configuración local directamente para evitar errores 401
        const config = gameConfigService.getLocalConfig('pair-words');
        setGameConfig(config);
        console.log('🎮 Configuración de pares cargada:', config);
      } catch (error) {
        console.warn('Error cargando configuración, usando fallback:', error);
        setGameConfig(gameConfigService.getDefaultConfig());
      }
    };

    loadGameConfig();
  }, []);

  // 🎮 Inicializar juego cuando fixedConfig esté listo
  useEffect(() => {
    if (fixedConfig) {
      console.log('🎮 Inicializando juego con config FIJA:', fixedConfig);
      setState(initialState(idLetter, fixedConfig));
    }
  }, [fixedConfig, idLetter]);

  // Detectar cuando se completa el juego
  useEffect(() => {
    if (!fixedConfig) return; // Esperar a que config esté lista
    
    console.log('🔍 Estado actual - correct:', state.correct, 'loading:', state.loading);
    
    // Solo verificar si el juego ya está cargado (!loading) y correct es 0
    if (!state.loading && state.correct === 0) { 
      console.log('🎉 ¡Todos los pares encontrados! Mostrando modal...');
      
      const totalPairs = fixedConfig.totalPairs;
      const finalScore = totalPairs * 100; // pares × 100 puntos
      const timeBonus = 10; // Bonus fijo
      const totalScore = finalScore + timeBonus;
      
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
        markAsCompleted(totalScore, {
          pairsFound: totalPairs,
          totalPairs: totalPairs,
          finalScore: totalScore,
          level: idLetter,
          completed: true,
          timeSpent: 60, // tiempo fijo de ejemplo
          accuracy: Math.round(accuracy),
          stars,
          correctAttempts,
          incorrectAttempts
        });
        
        console.log('✅ Juego completado! Score:', totalScore, 'Accuracy:', accuracy.toFixed(1) + '%', 'Estrellas:', stars);
      } catch (error) {
        console.log('⚠️ Progress save failed, but continuing to next level:', error);
      }

      // 🎮 Mostrar feedback gamificado con estrellas
      const motivationalMessage = stars >= 3 ? '¡Perfecto! ¡Excelente trabajo! 🎉👏' :
                                   stars >= 2 ? '¡Muy bien! ¡Sigue así! 😊⭐' :
                                   stars >= 1 ? '¡Buen intento! ¡Puedes mejorar! 💪' :
                                   '¡No te rindas! ¡Inténtalo de nuevo! 🎓';
      triggerFeedback(accuracy, motivationalMessage);

      // Navegar a la pantalla de nivel completado
      setTimeout(() => {
        console.log('🚀 Navegando a modal de felicitaciones...');
        history.push("/level-up", { 
          gameUrl: `/pares/${idLetter}`,
          accuracy: Math.round(accuracy)
        });
      }, 3500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [state.correct, state.loading, fixedConfig]); // Agregar fixedConfig como dependencia

  if (state.loading || !fixedConfig) {
    return (
      <div className="containerGame">
        <div>⏳ Cargando juego...</div>
      </div>
    );
  }
  return (
    <div className="containerGame">
      <Header></Header>
      <TitleSound
        title="Arma pares"
        titleSound={audioTitle}
        listAudio={[audioTitle]}
        ModalChild={PairInstructions}
        module="pair"
      />
      <div className="containerBox">
        <div className="pwContainerItems">
          <Board 
            cards={state.cards} 
            selectCard={selectCard} 
            deviceConfig={fixedConfig}
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

const Board = ({ cards, selectCard, deviceConfig }) => {
  // Obtener configuración responsiva (fallback a 4 columnas por defecto)
  const pairsPerRow = deviceConfig?.pairsPerRow || 4;
  
  let list = [];
  const rows = cards.reduce((prev, item, index) => {
    list.push(item);
    if ((index + 1) % pairsPerRow === 0) {
      prev.push(list);
      list = [];
    }
    return prev;
  }, []);

  // Si sobran elementos, agregar la fila incompleta
  if (list.length > 0) {
    rows.push(list);
  }

  return rows.map((item, rowIndex) => (
    <div 
      className={`pwRow rowCustom device-${deviceConfig?.deviceType || 'desktop'}`} 
      key={rowIndex}
    >
      {item.map((item, colIndex) => {
        // Calcular índice correcto basado en filas dinámicas
        const cardIndex = rowIndex * pairsPerRow + colIndex;
        return (
          <CardItem
            key={item.id * Math.random()}
            {...item}
            selectCard={() => selectCard(cardIndex)}
            deviceType={deviceConfig?.deviceType}
          />
        );
      })}
    </div>
  ));
};

const CardItem = ({ image, name, show, selectCard, check, deviceType }) => {
  // Clases CSS responsivas según el tipo de dispositivo
  const getCardClasses = () => {
    const baseClass = "pwImageCard";
    const coverClass = !show ? "coverImage" : "";
    const responsiveClass = deviceType ? `card-${deviceType}` : "";
    
    return `${baseClass} ${coverClass} ${responsiveClass}`.trim();
  };

  return (
    <div 
      className={`card-container ${check ? "hide" : ""} ${deviceType ? `container-${deviceType}` : ""}`} 
      onClick={selectCard}
    >
      <img
        className={getCardClasses()}
        src={!show ? cover : image}
        alt={name}
      />
    </div>
  );
};

function initialState(letter, deviceConfig) {
  const totalPairs = deviceConfig?.totalPairs || 4;
  console.log('🎯 initialState - Generando', totalPairs, 'pares para letra', letter, 'dispositivo:', deviceConfig?.deviceType);
  
  // Generar la cantidad correcta de pares según el dispositivo
  const selectedCards = getModuleData(letter, totalPairs);
  console.log('🃏 Cartas generadas:', selectedCards.length, 'total');
  
  return {
    open: 0,
    cards: selectedCards.map((item) => ({
      ...item,
      check: false,
      show: false,
    })),
    correct: totalPairs,
    loading: false, // Cambiar a false para que el juego esté listo
  };
}

export default PairWords;
