








































































































import React, { useEffect, useRef, useState } from 'react';
import '../../assets/styles/gamification.css';
import {
  RestExcelente,
  RestFelicitaciones,
  ResvMuybien,
  enunciadoCadaVezLoHacesMejor,
  enunciadoConfioEnTi,
  enunciadoExcelente,
  enunciadoIntentaloDeNuevo,
  enunciadoLoEstasHaciendoExcelente,
  enunciadoMuyBien,
  enunciadoSigueAsi,
  enunciadoTranquiloPuedesVolverAIntentarlo,
  enunciadoTuPuedes,
  enunciadoUnPasoALaVez,
  enunciadoVasMuyBien,
  resBien,
} from '../../utils/sounds';
import { usePlaySounds } from '../../hooks/usePlaySounds';

/**
 * Componente de retroalimentación gamificada
 * Muestra animaciones de estrellas/caritas y mensajes motivacionales
 * según el desempeño del jugador
 */
const GamificationFeedback = ({ 
  show, 
  performance, 
  onComplete,
  customMessage 
}) => {
  const [playSound, , stopSound] = usePlaySounds();
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState('excellent');
  const [starsToShow, setStarsToShow] = useState(3); // 📊 Cantidad de estrellas a mostrar
  const didPlayForThisShowRef = useRef(false);

  // Mensajes motivacionales según el desempeño
  const motivationalMessages = React.useMemo(() => ({
    excellent: [
      '¡Excelente trabajo! 🌟',
      '¡Eres increíble! ⭐',
      '¡Perfecto! ¡Sigue así! 🎉',
      '¡Wow! ¡Lo hiciste genial! 🏆',
      '¡Eres un campeón! 🥇'
    ],
    good: [
      '¡Muy bien! ¡Vas por buen camino! 👍',
      '¡Buen trabajo! Sigue practicando 💪',
      '¡Casi perfecto! ¡Sigue así! 🌟',
      '¡Lo estás haciendo muy bien! 😊'
    ],
    okay: [
      '¡Buen intento! Sigue practicando 💪',
      '¡Vas mejorando! ¡No te rindas! 😊',
      '¡Bien hecho! Puedes hacerlo mejor 🌟',
      '¡Sigue intentándolo! Cada vez mejor 👍'
    ],
    tryAgain: [
      '¡No te preocupes! ¡Inténtalo de nuevo! 💪',
      '¡Todos cometemos errores! Sigue intentando 😊',
      '¡Tú puedes! ¡Vamos a intentarlo otra vez! 🌈',
      '¡Aprender es practicar! ¡Vamos de nuevo! 🎯'
    ]
  }), []);

  // Determinar qué animación y mensaje mostrar según el desempeño
  useEffect(() => {
    if (show) {
      let level = 'okay';
      let stars = 1;
      
      if (performance >= 90) {
        level = 'excellent';
        stars = 3;
      } else if (performance >= 70) {
        level = 'good';
        stars = 2;
      } else if (performance >= 50) {
        level = 'okay';
        stars = 1;
      } else {
        level = 'tryAgain';
        stars = 0;
      }

      setPerformanceLevel(level);
      setStarsToShow(stars);

      // Seleccionar un mensaje aleatorio del nivel de desempeño
      const messages = motivationalMessages[level];
      const randomMessage = customMessage || messages[Math.floor(Math.random() * messages.length)];
      
      setMessage(randomMessage);
      setIsVisible(true);

      // 🔊 Reproducir audio de feedback UNA sola vez por aparición del modal
      if (!didPlayForThisShowRef.current) {
        didPlayForThisShowRef.current = true;

        const audioByLevel = {
          excellent: [
            enunciadoExcelente,
            enunciadoLoEstasHaciendoExcelente,
            RestExcelente,
            RestFelicitaciones,
          ],
          good: [
            enunciadoMuyBien,
            enunciadoVasMuyBien,
            enunciadoSigueAsi,
            ResvMuybien,
          ],
          okay: [resBien, enunciadoUnPasoALaVez, enunciadoCadaVezLoHacesMejor],
          tryAgain: [
            enunciadoTuPuedes,
            enunciadoIntentaloDeNuevo,
            enunciadoTranquiloPuedesVolverAIntentarlo,
            enunciadoConfioEnTi,
          ],
        };

        const list = audioByLevel[level] || [];
        const fallback = enunciadoTuPuedes;
        const selected = list.length
          ? list[Math.floor(Math.random() * list.length)]
          : fallback;

        // Cortar cualquier audio previo (instrucciones o carta) y reproducir feedback
        stopSound();
        playSound(selected);
      }

      // Auto-ocultar después de 5 segundos (aumentado de 3 segundos)
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(() => onComplete(), 500); // Esperar a que termine la transición
        }
      }, 5000); // ⏱️ Tiempo configurable: 5 segundos

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      didPlayForThisShowRef.current = false;
    }
  }, [show, performance, customMessage, onComplete, motivationalMessages]);

  if (!show || !isVisible) return null;

  return (
    <div className={`gamification-overlay ${isVisible ? 'show' : ''}`}>
      <div className={`gamification-content ${performanceLevel}`}>
        {/* Estrellas animadas en la parte superior */}
        <div className="stars-celebration">
          {starsToShow === 0 ? (
            // Sin estrellas - mostrar emoji de ánimo
            <div className="no-stars-container">
              <div className="encouragement-emoji">😊</div>
              <p className="encouragement-text">¡Sigue practicando!</p>
            </div>
          ) : (
            // Mostrar solo la cantidad de estrellas correspondiente
            Array.from({ length: starsToShow }, (_, index) => (
              <div 
                key={index}
                className="star-with-sparkles"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="star-emoji-large">⭐</div>
                <div className="sparkles-around">
                  <span className="sparkle sp-1">✨</span>
                  <span className="sparkle sp-2">✨</span>
                  <span className="sparkle sp-3">✨</span>
                  <span className="sparkle sp-4">✨</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="message-container">
          <h2 className="motivational-message">{message}</h2>
          {/* Porcentaje oculto para niños - se mantiene en BD para reportes de padres/docentes */}
        </div>
      </div>
    </div>
  );
};

export default GamificationFeedback;
