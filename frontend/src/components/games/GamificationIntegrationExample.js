/**
 * GUÍA DE INTEGRACIÓN - GAMIFICACIÓN PARA PINGUIPALABRAS
 * 
 * Este archivo muestra cómo integrar el sistema de gamificación
 * en cualquier juego del proyecto ProEducativo-Koala
 */

// ==========================================
// EJEMPLO 1: Integración Básica
// ==========================================

import React, { useState } from 'react';
import GamificationFeedback from '../components/games/GamificationFeedback';
import StarAnimation from '../components/games/StarAnimation';
import { useGamificationFeedback } from '../hooks/useGamificationFeedback';

const PinguiPalabrasExample = () => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  
  // Usar el hook de gamificación
  const {
    showFeedback,
    performance,
    customMessage,
    showSimpleFeedback,
    hideFeedback,
    getStarCount
  } = useGamificationFeedback();

  // Cuando el jugador completa el juego
  const handleGameComplete = () => {
    const correct = 8; // Ejemplo: 8 palabras correctas
    const total = 10; // Ejemplo: 10 intentos totales
    
    // Mostrar feedback de gamificación
    showSimpleFeedback(correct, total);
  };

  return (
    <div>
      {/* Tu juego aquí */}
      <button onClick={handleGameComplete}>Completar Juego</button>
      
      {/* Componente de feedback gamificado */}
      <GamificationFeedback
        show={showFeedback}
        performance={performance}
        customMessage={customMessage}
        onComplete={hideFeedback}
      />
      
      {/* Componente de estrellas (opcional) */}
      <StarAnimation
        stars={getStarCount(performance)}
        show={showFeedback}
      />
    </div>
  );
};


// ==========================================
// EJEMPLO 2: Integración Avanzada con Tiempo
// ==========================================

const PinguiPalabrasAdvancedExample = () => {
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [errors, setErrors] = useState(0);
  
  const {
    showFeedback,
    performance,
    showAdvancedFeedback,
    hideFeedback,
    getPerformanceLevel
  } = useGamificationFeedback();

  const handleGameComplete = () => {
    const timeElapsed = (Date.now() - gameStartTime) / 1000; // en segundos
    const targetTime = 60; // 60 segundos como tiempo objetivo
    
    // Mostrar feedback con bonus por velocidad
    showAdvancedFeedback(
      correctAnswers,
      errors,
      timeElapsed,
      targetTime,
      '¡Increíble velocidad!' // mensaje personalizado
    );
  };

  return (
    <div>
      {/* Tu juego aquí */}
      <GamificationFeedback
        show={showFeedback}
        performance={performance}
        onComplete={hideFeedback}
      />
    </div>
  );
};


// ==========================================
// EJEMPLO 3: Feedback por Cada Respuesta
// ==========================================

const PinguiPalabrasPerAnswerExample = () => {
  const [showStars, setShowStars] = useState(false);
  const [stars, setStars] = useState(0);

  const handleCorrectAnswer = () => {
    // Mostrar 3 estrellas por respuesta correcta
    setStars(3);
    setShowStars(true);
    
    setTimeout(() => {
      setShowStars(false);
    }, 2000);
  };

  const handleWrongAnswer = () => {
    // Mostrar 0 estrellas (carita triste) por respuesta incorrecta
    setStars(0);
    setShowStars(true);
    
    setTimeout(() => {
      setShowStars(false);
    }, 2000);
  };

  return (
    <div>
      {/* Tu juego aquí */}
      <button onClick={handleCorrectAnswer}>Respuesta Correcta</button>
      <button onClick={handleWrongAnswer}>Respuesta Incorrecta</button>
      
      <StarAnimation
        stars={stars}
        show={showStars}
        onComplete={() => setShowStars(false)}
      />
    </div>
  );
};


// ==========================================
// EJEMPLO 4: Integración Completa en Juego Real
// ==========================================

const PinguiPalabrasFullExample = () => {
  // Estado del juego
  const [gameState, setGameState] = useState({
    currentWord: 0,
    correctAnswers: 0,
    errors: 0,
    isPlaying: true,
    gameStartTime: Date.now()
  });

  // Gamificación
  const {
    showFeedback,
    performance,
    customMessage,
    showAdvancedFeedback,
    hideFeedback,
    getStarCount,
    getPerformanceLevel
  } = useGamificationFeedback();

  // Cuando el jugador da una respuesta correcta
  const handleCorrectAnswer = () => {
    setGameState(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1,
      currentWord: prev.currentWord + 1
    }));

    // Verificar si completó el juego
    if (gameState.currentWord + 1 >= 10) {
      handleGameComplete();
    }
  };

  // Cuando el jugador comete un error
  const handleError = () => {
    setGameState(prev => ({
      ...prev,
      errors: prev.errors + 1
    }));
  };

  // Cuando completa el juego
  const handleGameComplete = () => {
    const timeElapsed = (Date.now() - gameState.gameStartTime) / 1000;
    const targetTime = 120; // 2 minutos objetivo

    setGameState(prev => ({ ...prev, isPlaying: false }));

    // Determinar mensaje según desempeño
    let message = '';
    const totalAttempts = gameState.correctAnswers + gameState.errors;
    const accuracy = (gameState.correctAnswers / totalAttempts) * 100;

    if (accuracy >= 90) {
      message = '¡Perfecto! ¡Eres un genio de las palabras! 🌟';
    } else if (accuracy >= 70) {
      message = '¡Muy bien! Estás mejorando mucho 👏';
    } else if (accuracy >= 50) {
      message = '¡Buen trabajo! Sigue practicando 💪';
    } else {
      message = '¡No te rindas! La práctica hace al maestro 📚';
    }

    // Mostrar feedback
    showAdvancedFeedback(
      gameState.correctAnswers,
      gameState.errors,
      timeElapsed,
      targetTime,
      message
    );
  };

  const handleFeedbackComplete = () => {
    hideFeedback();
    // Aquí puedes redirigir al menú o reiniciar el juego
    // history.push('/menu');
  };

  return (
    <div className="pingui-palabras-game">
      {gameState.isPlaying ? (
        <div>
          {/* Tu interfaz de juego aquí */}
          <h2>Palabra {gameState.currentWord + 1} de 10</h2>
          <p>Correctas: {gameState.correctAnswers}</p>
          <p>Errores: {gameState.errors}</p>
          
          {/* Botones de ejemplo */}
          <button onClick={handleCorrectAnswer}>Respuesta Correcta</button>
          <button onClick={handleError}>Respuesta Incorrecta</button>
        </div>
      ) : (
        <div>
          <h2>¡Juego Completado!</h2>
        </div>
      )}

      {/* Componentes de gamificación */}
      <GamificationFeedback
        show={showFeedback}
        performance={performance}
        customMessage={customMessage}
        onComplete={handleFeedbackComplete}
      />

      <StarAnimation
        stars={getStarCount(performance)}
        show={showFeedback}
      />
    </div>
  );
};


// ==========================================
// CONFIGURACIÓN DE MENSAJES PERSONALIZADOS
// ==========================================

export const customGameMessages = {
  pinguiPalabras: {
    excellent: [
      '¡Pingüi está orgulloso de ti! 🐧⭐',
      '¡Dominas las palabras como un campeón! 🏆',
      '¡Perfecto! ¡Eres un maestro de las letras! 📚✨'
    ],
    good: [
      '¡Pingüi dice: Muy bien! 🐧👍',
      '¡Vas por buen camino! Sigue así 💪',
      '¡Buen trabajo con las palabras! 📝'
    ],
    okay: [
      'Pingüi te anima: ¡Sigue intentando! 🐧💙',
      '¡Cada intento te hace mejor! 🌟',
      '¡Buen esfuerzo! Practica más 📖'
    ],
    tryAgain: [
      'Pingüi dice: ¡No te rindas! 🐧❤️',
      '¡Los errores nos ayudan a aprender! 🌈',
      '¡Inténtalo otra vez! Tú puedes 💪'
    ]
  }
};


// ==========================================
// UTILIDADES PARA GAMIFICACIÓN
// ==========================================

/**
 * Calcula el nivel de estrellitas según el porcentaje
 */
export const calculateStars = (percentage) => {
  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  if (percentage >= 50) return 1;
  return 0;
};

/**
 * Obtiene un mensaje aleatorio según el nivel
 */
export const getRandomMessage = (level, gameType = 'default') => {
  const messages = customGameMessages[gameType] || customGameMessages.pinguiPalabras;
  const messageArray = messages[level] || messages.okay;
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};


// ==========================================
// EXPORT PARA USO EN OTROS COMPONENTES
// ==========================================

export {
  PinguiPalabrasExample,
  PinguiPalabrasAdvancedExample,
  PinguiPalabrasPerAnswerExample,
  PinguiPalabrasFullExample
};

export default PinguiPalabrasFullExample;
