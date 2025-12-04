import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar la lógica de gamificación
 * Gestiona el estado de las animaciones y el cálculo del desempeño
 */
export const useGamificationFeedback = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [performance, setPerformance] = useState(0);
  const [customMessage, setCustomMessage] = useState('');

  /**
   * Calcula el desempeño basado en aciertos y errores
   * @param {number} correct - Número de respuestas correctas
   * @param {number} total - Total de intentos
   * @returns {number} Porcentaje de desempeño (0-100)
   */
  const calculatePerformance = useCallback((correct, total) => {
    if (total === 0) return 0;
    return (correct / total) * 100;
  }, []);

  /**
   * Calcula el desempeño basado en aciertos, errores y tiempo
   * @param {number} correct - Número de respuestas correctas
   * @param {number} errors - Número de errores
   * @param {number} timeSeconds - Tiempo tomado en segundos
   * @param {number} targetTime - Tiempo objetivo en segundos (opcional)
   * @returns {number} Porcentaje de desempeño (0-100)
   */
  const calculateAdvancedPerformance = useCallback((correct, errors, timeSeconds, targetTime = null) => {
    const total = correct + errors;
    if (total === 0) return 0;

    // Calcular porcentaje base de aciertos
    let accuracyScore = (correct / total) * 100;

    // Si hay tiempo objetivo, ajustar el score basado en el tiempo
    if (targetTime && timeSeconds > 0) {
      const timeRatio = Math.min(targetTime / timeSeconds, 1);
      const timeBonus = timeRatio * 20; // Hasta 20% de bonus por velocidad
      accuracyScore = Math.min(accuracyScore + timeBonus, 100);
    }

    // Penalizar errores excesivos
    const errorPenalty = (errors / total) * 10; // Hasta 10% de penalización
    const finalScore = Math.max(accuracyScore - errorPenalty, 0);

    return finalScore;
  }, []);

  /**
   * Muestra el feedback de gamificación
   * @param {number} performanceValue - Valor de desempeño (0-100)
   * @param {string} message - Mensaje personalizado (opcional)
   */
  const triggerFeedback = useCallback((performanceValue, message = '') => {
    setPerformance(performanceValue);
    setCustomMessage(message);
    setShowFeedback(true);
  }, []);

  /**
   * Muestra feedback basado en aciertos y total
   * @param {number} correct - Número de respuestas correctas
   * @param {number} total - Total de intentos
   * @param {string} message - Mensaje personalizado (opcional)
   */
  const showSimpleFeedback = useCallback((correct, total, message = '') => {
    const perf = calculatePerformance(correct, total);
    triggerFeedback(perf, message);
  }, [calculatePerformance, triggerFeedback]);

  /**
   * Muestra feedback avanzado con tiempo
   * @param {number} correct - Número de respuestas correctas
   * @param {number} errors - Número de errores
   * @param {number} timeSeconds - Tiempo tomado en segundos
   * @param {number} targetTime - Tiempo objetivo (opcional)
   * @param {string} message - Mensaje personalizado (opcional)
   */
  const showAdvancedFeedback = useCallback((correct, errors, timeSeconds, targetTime = null, message = '') => {
    const perf = calculateAdvancedPerformance(correct, errors, timeSeconds, targetTime);
    triggerFeedback(perf, message);
  }, [calculateAdvancedPerformance, triggerFeedback]);

  /**
   * Oculta el feedback
   */
  const hideFeedback = useCallback(() => {
    setShowFeedback(false);
    setCustomMessage('');
  }, []);

  /**
   * Obtiene un nivel de desempeño textual
   * @param {number} performanceValue - Valor de desempeño (0-100)
   * @returns {string} Nivel de desempeño ('excellent', 'good', 'okay', 'tryAgain')
   */
  const getPerformanceLevel = useCallback((performanceValue) => {
    if (performanceValue >= 90) return 'excellent';
    if (performanceValue >= 70) return 'good';
    if (performanceValue >= 50) return 'okay';
    return 'tryAgain';
  }, []);

  /**
   * Obtiene el número de estrellas según el desempeño
   * @param {number} performanceValue - Valor de desempeño (0-100)
   * @returns {number} Número de estrellas (0-3)
   */
  const getStarCount = useCallback((performanceValue) => {
    if (performanceValue >= 90) return 3;
    if (performanceValue >= 70) return 2;
    if (performanceValue >= 50) return 1;
    return 0;
  }, []);

  return {
    // Estado
    showFeedback,
    performance,
    customMessage,
    
    // Funciones para mostrar feedback
    triggerFeedback,
    showSimpleFeedback,
    showAdvancedFeedback,
    hideFeedback,
    
    // Funciones de cálculo
    calculatePerformance,
    calculateAdvancedPerformance,
    getPerformanceLevel,
    getStarCount
  };
};

export default useGamificationFeedback;
