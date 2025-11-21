import React from 'react';

const GameCard = ({ game, onClick }) => {
  // 🔍 Log para depurar qué datos recibe el componente
  console.log(`🎮 GameCard "${game.name}" recibe:`, {
    id: game.id,
    stars: game.stars,
    maxStars: game.maxStars,
    lastScore: game.lastScore,
    isAvailable: game.isAvailable,
    completoObjeto: game
  });
  
  const renderStars = () => {
    const stars = [];
    const maxVisibleStars = 5; // 🎯 Máximo 5 estrellas visibles
    const starsToShow = Math.min(game.stars, maxVisibleStars);
    const maxStarsToShow = Math.min(game.maxStars, maxVisibleStars);
    
    // Mostrar hasta 5 estrellas visuales
    for (let i = 0; i < maxStarsToShow; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i < starsToShow ? 'filled' : 'empty'}`}
        >
          {i < starsToShow ? '⭐' : '☆'}
        </span>
      );
    }
    
    // Si hay más de 5 estrellas, mostrar el número
    if (game.stars > maxVisibleStars) {
      stars.push(
        <span key="extra" className="star-count">
          +{game.stars - maxVisibleStars}
        </span>
      );
    }
    
    return stars;
  };

  const getProgressPercentage = () => {
    return (game.stars / game.maxStars) * 100;
  };

  const getCardStatus = () => {
    // Si el juego no está disponible, siempre es 'disabled'
    if (!game.isAvailable) return 'disabled';
    
    if (game.stars === game.maxStars) return 'perfect';
    if (game.stars > 0) return 'good';
    return 'new';
  };

  return (
    <div 
      className={`game-card ${getCardStatus()}`}
      style={{ 
        backgroundColor: game.isAvailable ? game.color : '#cccccc',
        opacity: game.isAvailable ? 1 : 0.6,
        cursor: game.isAvailable ? 'pointer' : 'not-allowed',
        filter: game.isAvailable ? 'none' : 'grayscale(60%)',
        position: 'relative'
      }}
      onClick={game.isAvailable ? onClick : () => alert('🔒 Juego no disponible temporalmente')}
    >
      {/* Icono del juego */}
      <div className="game-icon">
        {game.isAvailable ? (
          <img 
            className="icon-svg" 
            src={game.icon} 
            alt={game.name}
            width="50"
            height="50"
          />
        ) : (
          <span className="icon-emoji">🔒</span>
        )}
      </div>

      {/* Nombre del juego */}
      <div className="game-name" style={{ 
        color: game.isAvailable ? 'white' : '#666'
      }}>
        {game.name}
      </div>

      {/* Contenido cuando está disponible */}
      {game.isAvailable ? (
        <>
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
        </>
      ) : (
        /* Contenido para juegos no disponibles */
        <div className="disabled-content">
          <div className="disabled-message">
            <div className="disabled-icon">�</div>
            <div className="disabled-text">No disponible</div>
            <div className="disabled-subtitle">Temporalmente desactivado</div>
          </div>
        </div>
      )}

      {/* Overlay de bloqueo para juegos desactivados */}
      {!game.isAvailable && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '15px',
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '10px 15px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔒</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
              DESACTIVADO
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;