import React, { useEffect, useState } from 'react';
import '../../assets/styles/star-animation.css';

/**
 * Componente de animación de estrellas
 * Muestra de 0 a 3 estrellas según el desempeño
 */
const StarAnimation = ({ stars = 0, show = false, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      console.log('⭐ Mostrando estrellas:', stars);
      setIsVisible(true);
      
      // Auto-ocultar después de que termine la animación
      const timer = setTimeout(() => {
        console.log('⭐ Ocultando estrellas');
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 2000); // 2 segundos de duración

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, onComplete, stars]);

  if (!show || !isVisible) return null;

  // Crear array de estrellas según el número
  const starElements = Array.from({ length: Math.min(Math.max(stars, 0), 3) }, (_, i) => i);

  return (
    <div className={`star-animation-container ${isVisible ? 'show' : ''}`}>
      <div className="stars-wrapper">
        {starElements.map((_, index) => (
          <div 
            key={index} 
            className="star-item"
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="star-emoji">⭐</div>
            <div className="sparkles">
              <span className="sparkle sparkle-1">✨</span>
              <span className="sparkle sparkle-2">✨</span>
              <span className="sparkle sparkle-3">✨</span>
              <span className="sparkle sparkle-4">✨</span>
            </div>
          </div>
        ))}
      </div>
      {stars === 0 && (
        <div className="no-stars-message">
          <span className="emoji-sad">😔</span>
          <p>¡Sigue intentándolo!</p>
        </div>
      )}
    </div>
  );
};

/**
 * Componente de carita animada según el desempeño
 */
export const FaceAnimation = ({ type = 'happy', show = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || !isVisible) return null;

  // Emojis según el tipo
  const faceEmojis = {
    excellent: '😄',
    happy: '😊',
    okay: '🙂',
    sad: '😔',
    tryAgain: '💪'
  };

  const messages = {
    excellent: '¡Increíble!',
    happy: '¡Muy bien!',
    okay: '¡Buen intento!',
    sad: 'Casi...',
    tryAgain: '¡Inténtalo de nuevo!'
  };

  return (
    <div className={`face-animation ${isVisible ? 'show' : ''}`}>
      <div className="face-emoji">
        {faceEmojis[type] || faceEmojis.happy}
      </div>
      <p className="face-message">{messages[type] || messages.happy}</p>
    </div>
  );
};

export default StarAnimation;
