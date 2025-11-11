import React from 'react';

const KoalaAvatar = ({ level, mood = 'happy' }) => {
  // Diferentes estados del koala según el nivel y humor
  const getKoalaEmoji = () => {
    if (level >= 5) return '🤩'; // Koala súper feliz
    if (level >= 3) return '😄'; // Koala muy contento  
    if (level >= 1) return '😊'; // Koala feliz
    return '🙂'; // Koala neutral
  };

  const getKoalaMessage = () => {
    if (level >= 5) return "¡Eres increíble!";
    if (level >= 3) return "¡Muy bien hecho!";
    if (level >= 1) return "¡Sigue así!";
    return "¡Empecemos a jugar!";
  };

  const getLevelColor = () => {
    if (level >= 5) return '#FF6B6B'; // Rojo brillante
    if (level >= 3) return '#4ECDC4'; // Turquesa
    if (level >= 1) return '#45B7D1'; // Azul
    return '#96CEB4'; // Verde suave
  };

  return (
    <div className="koala-avatar">
      <div className="koala-container" style={{ borderColor: getLevelColor() }}>
        <div className="koala-face">{getKoalaEmoji()}</div>
        <div className="koala-level">Nivel {level}</div>
      </div>
      <div className="koala-message">{getKoalaMessage()}</div>
      
      {/* Efectos de partículas para niveles altos */}
      {level >= 3 && (
        <div className="koala-effects">
          <span className="particle">✨</span>
          <span className="particle">🌟</span>
          <span className="particle">⭐</span>
        </div>
      )}
    </div>
  );
};

export default KoalaAvatar;