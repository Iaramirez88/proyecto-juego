import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import background from "../../assets/images/fondoModPares.svg";
import { useSetBackGround } from "../../hooks/useSetBackGround";
import audioTitle from "../../assets/sounds/intructions/modArmarPares.mp3";
import { getModuleData } from "../../utils/mockData/modPairs";
import { GameContext } from "../../context/GameContext";
import { useResponseAudio } from "../../hooks/usePlaySounds";

import cover from "../../assets/images/cuadroMorado.svg";
import "../../assets/styles/pair-module.css";
import Header from "../../components/shared/Header";
import TitleSound from "../../components/shared/TitleSound";
import PairInstructions from "../../components/games/PairModule/PairInstructions";
import { useSetScrollPosition } from "../../hooks/useDimesion";

// Importaciones para sistema responsivo
import { useDeviceDetection, useDevicePairConfig } from "../../hooks/useDeviceDetection";
import gameConfigService from "../../services/gameConfigService";

const PairWords = () => {
  useSetBackGround(background);
  useSetScrollPosition();

  const { idLetter } = useParams();
  const { dispatch } = useContext(GameContext);
  const [state, setState] = useState({
    open: 0,
    cards: [],
    correct: 4,
    loading: false,
  });
  const history = useHistory();
  const [playResponseAudio] = useResponseAudio();

  // Estados para sistema responsivo
  const deviceType = useDeviceDetection();
  const fallbackDeviceConfig = useDevicePairConfig(deviceType);
  const [gameConfig, setGameConfig] = useState(null);
  
  // Obtener configuración específica del dispositivo desde el backend o usar fallback
  const deviceConfig = gameConfig 
    ? gameConfigService.getDeviceConfig(gameConfig, deviceType)
    : fallbackDeviceConfig;

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

    playResponseAudio(isCorrect);
    dispatch({
      type: "ADD_POINTS",
      value: isCorrect ? 3 : -1,
    });
    // Delay de 1 segundo antes de avanzar
    setTimeout(() => {
      if (isCorrect) {
        list[0].check = true;
        list[1].check = true;
      }
      const cardState = {
        ...state,
        open: 0,
        correct: isCorrect ? state.correct - 1 : state.correct,
        cards: isCorrect
          ? [...cards]
          : state.cards.map((item) => ({ ...item, show: false })),
      };
      setState(cardState);
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

  // Cargar configuración del juego desde el backend
  useEffect(() => {
    const loadGameConfig = async () => {
      try {
        // IDs temporales - en producción vendrían del contexto de usuario/auth
        const gameId = "8402a754-3558-4950-80df-0a7ece78129e"; // ID del juego de pares
        const institutionId = "ee459320-c366-4bb2-bd4a-249bf8bd64f5"; // ID de institución
        
        const config = await gameConfigService.getGameConfig(gameId, institutionId);
        setGameConfig(config);
      } catch (error) {
        console.warn('No se pudo cargar configuración del backend, usando configuración por defecto');
        setGameConfig(gameConfigService.getDefaultConfig());
      }
    };

    loadGameConfig();
  }, []);

  useEffect(() => {
    const { correct } = state;
    if (!state.loading) {
      setState(initialState(idLetter));
    }
    if (correct === 0) { 
      history.push("/level-up", { gameUrl: `/pares/${idLetter}` });
    }
  }, [state, history, idLetter]);

  if (!state.loading) return <div></div>;
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
            deviceConfig={deviceConfig}
          />
        </div>
      </div>
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

function initialState(letter) {
  return {
    open: 0,
    cards: getModuleData(letter).map((item) => ({
      ...item,
      check: false,
      show: false,
    })),
    correct: 4,
    loading: true,
  };
}

export default PairWords;
