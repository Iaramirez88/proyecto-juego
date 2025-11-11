import React from 'react';

const GameCard = ({ game, onClick }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < game.maxStars; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i < game.stars ? 'filled' : 'empty'}`}
        >
          {i < game.stars ? '⭐' : '☆'}
        </span>
      );
    }
    return stars;
  };

  const getProgressPercentage = () => {
    return (game.stars / game.maxStars) * 100;
  };

  const getCardStatus = () => {
    if (game.stars === game.maxStars) return 'perfect';
    if (game.stars > 0) return 'good';
    return 'new';
  };

  return (
    <div 
      className={`game-card ${getCardStatus()}`}
      style={{ backgroundColor: game.color }}
      onClick={onClick}
    >
      {/* Icono del juego */}
      <div className="game-icon">
        <span className="icon-emoji">{game.icon}</span>
      </div>

      {/* Nombre del juego */}
      <div className="game-name">{game.name}</div>

      {/* Estrellas de progreso */}
      <div className="game-stars">
        {renderStars()}
      </div>

      {/* Barra de progreso visual */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Estado del juego */}
      <div className="game-status">
        {game.stars === 0 && (
          <span className="status-badge new">¡Nuevo!</span>
        )}
        {game.stars > 0 && game.stars < game.maxStars && (
          <span className="status-badge progress">¡Sigue así!</span>
        )}
        {game.stars === game.maxStars && (
          <span className="status-badge completed">¡Perfecto!</span>
        )}
      </div>

      {/* Última puntuación si existe */}
      {game.lastScore > 0 && (
        <div className="last-score">
          <span className="score-icon">🎯</span>
          <span className="score-value">{game.lastScore}</span>
        </div>
      )}

      {/* Efectos visuales para juegos completados */}
      {game.stars === game.maxStars && (
        <div className="completion-effects">
          <span className="sparkle">✨</span>
          <span className="sparkle">🌟</span>
        </div>
      )}
    </div>
  );
};

export default GameCard;