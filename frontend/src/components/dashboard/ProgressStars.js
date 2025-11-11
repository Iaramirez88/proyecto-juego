import React from 'react';

const ProgressStars = ({ current, total, level }) => {
  const percentage = (current / total) * 100;
  const nextLevelStars = (level * 10) - current; // Estrellas para siguiente nivel

  const renderProgressStars = () => {
    const stars = [];
    const starCount = Math.min(10, Math.floor(percentage / 10)); // Máximo 10 estrellas visibles
    
    for (let i = 0; i < 10; i++) {
      stars.push(
        <span 
          key={i} 
          className={`progress-star ${i < starCount ? 'earned' : 'pending'}`}
        >
          {i < starCount ? '⭐' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="progress-stars-container">
      {/* Contador principal de estrellas */}
      <div className="stars-counter">
        <span className="current-stars">{current}</span>
        <span className="stars-separator"> / </span>
        <span className="total-stars">{total}</span>
        <span className="stars-emoji"> ⭐</span>
      </div>

      {/* Barra de progreso con estrellas */}
      <div className="stars-progress-bar">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="stars-row">
          {renderProgressStars()}
        </div>
      </div>

      {/* Indicador de nivel actual */}
      <div className="level-indicator">
        <div className="level-badge">
          <span className="level-icon">🏆</span>
          <span className="level-text">Nivel {level}</span>
        </div>
        
        {/* Mensaje motivacional */}
        <div className="motivation-text">
          {nextLevelStars > 0 ? (
            <span>¡{nextLevelStars} estrellitas más para subir de nivel!</span>
          ) : (
            <span>¡Felicidades! Has alcanzado el nivel {level}</span>
          )}
        </div>
      </div>

      {/* Efectos especiales para logros */}
      {percentage >= 100 && (
        <div className="achievement-effects">
          <span className="effect-particle">🎉</span>
          <span className="effect-particle">🌟</span>
          <span className="effect-particle">✨</span>
        </div>
      )}
    </div>
  );
};

export default ProgressStars;