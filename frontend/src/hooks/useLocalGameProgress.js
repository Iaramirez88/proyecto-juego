/**
 * Hook para manejo de progreso local
 * Funciona con localStorage sin backend
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import localProgressService from '../services/localProgressService';

export const useLocalGameProgress = (gameId, level = 'default') => {
  const [gameState, setGameState] = useState({
    score: 0,
    timeElapsed: 0,
    attempts: 0,
    isCompleted: false,
    stars: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Referencias para tracking
  const gameStartTime = useRef(Date.now());
  const hasBeenSaved = useRef(false);

  // Cargar progreso existente al inicializar
  useEffect(() => {
    const loadExistingProgress = async () => {
      try {
        setIsLoading(true);
        const existingProgress = localProgressService.getGameProgress(gameId, level);
        
        if (existingProgress) {
          console.log(`📊 Progreso cargado para ${gameId}:`, existingProgress);
          // No sobrescribir el estado actual del juego, solo mostrar el progreso anterior
          setGameState(prevState => ({
            ...prevState,
            attempts: existingProgress.attempts || 0,
            // Mantener score actual, no el mejor score anterior
            stars: existingProgress.levelProgress?.stars || existingProgress.stars || 0
          }));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading progress:', err);
        setError('No se pudo cargar el progreso anterior');
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId) {
      gameStartTime.current = Date.now();
      loadExistingProgress();
    }
  }, [gameId, level]);

  // Función para actualizar el score
  const updateScore = useCallback((newScore, additionalData = {}) => {
    setGameState(prevState => {
      const updatedState = {
        ...prevState,
        score: newScore,
        timeElapsed: Math.floor((Date.now() - gameStartTime.current) / 1000),
        ...additionalData
      };

      console.log(`🎯 Score actualizado en ${gameId}:`, updatedState);
      return updatedState;
    });
  }, [gameId]);

  // Función para marcar como completado
  const markAsCompleted = useCallback((finalScore = null, additionalData = {}) => {
    const finalTimeElapsed = Math.floor((Date.now() - gameStartTime.current) / 1000);
    const scoreToUse = finalScore !== null ? finalScore : gameState.score;

    setGameState(prevState => ({
      ...prevState,
      score: scoreToUse,
      timeElapsed: finalTimeElapsed,
      isCompleted: true,
      ...additionalData
    }));

    // Guardar inmediatamente al completar
    const progressData = {
      gameId,
      score: scoreToUse,
      timeSpent: finalTimeElapsed,
      level,
      additionalData: {
        ...additionalData,
        completed: true,
        attempts: gameState.attempts + 1,
        level
      }
    };

    localProgressService.saveGameProgress(progressData);
  }, [gameId, gameState.score, gameState.attempts, level]);

  // Función para guardar progreso
  const saveProgress = useCallback(async (score = null, timeSpent = null, additionalData = {}) => {
    try {
      const scoreToSave = score !== null ? score : gameState.score;
      const timeToSave = timeSpent !== null ? timeSpent : Math.floor((Date.now() - gameStartTime.current) / 1000);

      const progressData = {
        gameId,
        score: scoreToSave,
        timeSpent: timeToSave,
        level,
        additionalData: {
          ...additionalData,
          attempts: gameState.attempts + 1,
          level
        }
      };

      console.log(`💾 Guardando progreso de ${gameId}:`, progressData);

      const result = localProgressService.saveGameProgress(progressData);

      if (result.success) {
        console.log(`✅ Progreso guardado exitosamente para ${gameId}`, result.data);
        
        // Actualizar estado con los datos guardados
        setGameState(prevState => ({
          ...prevState,
          attempts: prevState.attempts + 1,
          stars: result.data.levelProgress?.stars || 0
        }));

        hasBeenSaved.current = true;
        setError(null);
        return result;
      } else {
        throw new Error(result.error || 'Error al guardar progreso');
      }

    } catch (err) {
      console.error('❌ Error saving progress:', err);
      setError('No se pudo guardar el progreso');
      return { success: false, error: err.message };
    }
  }, [gameId, level, gameState.score, gameState.attempts]);

  // Auto-guardar al salir de la página
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (gameState.score > 0 && !hasBeenSaved.current) {
        console.log(`🔄 Auto-guardando progreso de ${gameId} antes de salir`);
        saveProgress();
        
        // Mostrar confirmación si hay progreso no guardado
        const message = 'Tienes progreso no guardado. ¿Estás seguro que quieres salir?';
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameId, gameState.score, saveProgress]);

  // Limpiar referencias al desmontar
  useEffect(() => {
    return () => {
      hasBeenSaved.current = false;
    };
  }, []);

  // Función para reiniciar el juego
  const resetGame = useCallback(() => {
    console.log(`🔄 Reiniciando ${gameId}`);
    setGameState({
      score: 0,
      timeElapsed: 0,
      attempts: gameState.attempts, // Mantener intentos anteriores
      isCompleted: false,
      stars: gameState.stars // Mantener estrellas anteriores
    });
    gameStartTime.current = Date.now();
    hasBeenSaved.current = false;
    setError(null);
  }, [gameId, gameState.attempts, gameState.stars]);

  // Función para obtener el progreso histórico
  const getProgressHistory = useCallback(() => {
    return localProgressService.getGameProgress(gameId, level);
  }, [gameId, level]);

  return {
    // Estado del juego actual
    gameState,
    
    // Estado del hook
    isLoading,
    error,
    
    // Funciones de control
    updateScore,
    markAsCompleted,
    saveProgress,
    resetGame,
    getProgressHistory,
    
    // Estado de utilidad
    hasUnsavedProgress: gameState.score > 0 && !hasBeenSaved.current,
    gameTimeElapsed: Math.floor((Date.now() - gameStartTime.current) / 1000)
  };
};

export default useLocalGameProgress;