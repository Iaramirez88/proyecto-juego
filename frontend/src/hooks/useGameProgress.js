import { useEffect, useRef, useState, useCallback } from 'react';
import ProgressService from '../services/progressService';
import { AuthUtils } from '../services/gameService';

/**
 * Hook personalizado para manejo automático de progreso de juegos
 * 
 * @param {Object} gameInfo - Información del juego
 * @param {string} gameInfo.gameId - ID del juego en la base de datos
 * @param {string} gameInfo.gameType - Tipo de juego (pares, fall, audio, etc.)
 * @param {string} [gameInfo.activityId] - ID de la actividad (opcional)
 * @param {number} [gameInfo.maxScore] - Puntuación máxima posible
 * @returns {Object} Funciones y estado para manejo de progreso
 */
export const useGameProgress = (gameInfo) => {
  const [progressState, setProgressState] = useState({
    isSaving: false,
    lastSaved: null,
    error: null
  });

  // Referencias para tracking
  const gameStartTime = useRef(Date.now());
  const lastScore = useRef(0);
  const totalTimeSpent = useRef(0);

  /**
   * Calcular puntuación como porcentaje
   */
  const calculateScorePercentage = (currentScore, maxScore = 100) => {
    if (!maxScore || maxScore === 0) return 0;
    return Math.min(100, Math.max(0, Math.round((currentScore / maxScore) * 100)));
  };

  /**
   * Calcular tiempo transcurrido en segundos
   */
  const getTimeSpent = () => {
    return Math.round((Date.now() - gameStartTime.current) / 1000);
  };

  /**
   * Guardar progreso automáticamente
   */
  const saveProgress = useCallback(async (overrides = {}) => {
    try {
      setProgressState(prev => ({ ...prev, isSaving: true, error: null }));

      const currentUserId = AuthUtils.getCurrentUserId() || 'guest-user';
      
      const timeSpent = getTimeSpent();
      totalTimeSpent.current += timeSpent;

      const progressData = {
        userId: currentUserId,
        gameId: gameInfo.gameId,
        activityId: gameInfo.activityId || null,
        score: calculateScorePercentage(
          overrides.score !== undefined ? overrides.score : 0,
          gameInfo.maxScore
        ),
        timeSpent: overrides.timeSpent || timeSpent,
        completed: overrides.completed || false,
        gameData: {
          gameType: gameInfo.gameType,
          level: gameInfo.level || null,
          attempts: (overrides.attempts || 0) + 1,
          maxScore: gameInfo.maxScore,
          rawScore: overrides.score !== undefined ? overrides.score : 0,
          timestamp: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            screen: {
              width: window.screen.width,
              height: window.screen.height
            }
          },
          ...overrides.gameData
        }
      };

      const result = await ProgressService.saveGameProgress(progressData);
      
      setProgressState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        error: null
      }));

      // Reset start time for next session
      gameStartTime.current = Date.now();
      lastScore.current = overrides.score !== undefined ? overrides.score : 0;

      return result;
    } catch (error) {
      console.warn('Error saving game progress, continuing without save:', error);
      
      // No lanzar error, solo loggearlo y continuar
      setProgressState(prev => ({
        ...prev,
        isSaving: false,
        error: `Offline mode: ${error.message}`
      }));

      // Reset start time for next session even if save failed
      gameStartTime.current = Date.now();
      lastScore.current = overrides.score !== undefined ? overrides.score : 0;

      return { success: false, error: error.message };
    }
  }, [gameInfo]);

  /**
   * Guardar progreso al completar el juego
   */
  const saveGameCompletion = useCallback(async (finalScore, additionalData = {}) => {
    return saveProgress({
      score: finalScore,
      completed: true,
      timeSpent: getTimeSpent(),
      ...additionalData
    });
  }, [saveProgress]);

  /**
   * Guardar progreso incremental (durante el juego)
   */
  const saveIncrementalProgress = useCallback(async (additionalData = {}) => {
    return saveProgress({
      completed: false,
      ...additionalData
    });
  }, [saveProgress]);

  /**
   * Auto-save al abandonar la página
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gameInfo.gameId && lastScore.current > 0) {
        // Intentar guardar antes de salir (no async por limitaciones del navegador)
        navigator.sendBeacon('/api/progress', JSON.stringify({
          userId: AuthUtils.getCurrentUserId(),
          gameId: gameInfo.gameId,
          score: calculateScorePercentage(lastScore.current, gameInfo.maxScore),
          timeSpent: getTimeSpent(),
          completed: false,
          gameData: {
            gameType: gameInfo.gameType,
            exitSave: true,
            timestamp: new Date().toISOString()
          }
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameInfo]);

  return {
    // Estado del progreso
    progressState,
    
    // Funciones principales
    saveProgress,
    saveGameCompletion,
    saveIncrementalProgress,
    
    // Utilidades
    calculateScorePercentage,
    getTimeSpent: () => getTimeSpent(),
    getTotalTimeSpent: () => totalTimeSpent.current,
    
    // Info del juego actual
    gameInfo: {
      ...gameInfo,
      currentScore: lastScore.current || 0,
      scorePercentage: calculateScorePercentage(
        lastScore.current || 0, 
        gameInfo.maxScore
      ),
      startTime: gameStartTime.current
    }
  };
};

/**
 * Hook simplificado para juegos que solo necesitan guardado al finalizar
 */
export const useSimpleGameProgress = (gameId, gameType, maxScore = 100) => {
  const gameProgress = useGameProgress({
    gameId,
    gameType,
    maxScore
  });

  return {
    saveOnComplete: gameProgress.saveGameCompletion,
    progressState: gameProgress.progressState,
    currentScore: gameProgress.gameInfo.currentScore,
    scorePercentage: gameProgress.gameInfo.scorePercentage
  };
};

export default useGameProgress;