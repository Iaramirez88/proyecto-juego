import React, { useState } from 'react';
import LevelDetails from './LevelDetails';

const GameCard = ({ game, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);
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

  const hasLevels = game.levels && Object.keys(game.levels).length > 0;

  const handleCardClick = (e) => {
    // Si se hizo click en el botón de detalles, no ejecutar onClick
    if (e.target.closest('.details-toggle')) {
      return;
    }
    if (game.isAvailable && onClick) {
      onClick();
    }
  };

  const toggleDetails = (e) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <>
      <div 
        className={`game-card ${getCardStatus()}`}
        style={{ 
          backgroundColor: game.isAvailable ? game.color : '#cccccc',
          opacity: game.isAvailable ? 1 : 0.6,
          cursor: game.isAvailable ? 'pointer' : 'not-allowed',
          filter: game.isAvailable ? 'none' : 'grayscale(60%)',
          position: 'relative'
        }}
        onClick={handleCardClick}
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

          {/* Última puntuación si existe */}
          {game.lastScore > 0 && (
            <div className="last-score">
              <span className="score-icon">🎯</span>
              <span className="score-value">{game.lastScore}</span>
            </div>
          )}
          
          {/* 📊 Mostrar accuracy si está disponible */}
          {game.accuracy !== undefined && game.accuracy !== null && (
            <div className="accuracy-display">
              <span className="accuracy-icon">✓</span>
              <span className="accuracy-value">{Math.round(game.accuracy)}%</span>
              <span className="accuracy-label">Aciertos</span>
            </div>
          )}

          {/* Botón para ver detalles de niveles */}
          {hasLevels && (
            <button 
              className="details-toggle"
              onClick={toggleDetails}
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
                backdropFilter: 'blur(5px)',
                border: '2px solid rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                padding: '0.7rem 1.2rem',
                marginTop: '0.8rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'white',
                fontWeight: 'bold',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                width: '100%',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 100%)';
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)';
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🔍</span>
              <span>Ver detalles</span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '0.2rem 0.6rem',
                borderRadius: '15px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>{Object.keys(game.levels).length}</span>
            </button>
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

      {/* Modal popup con detalles de niveles */}
      {showDetails && hasLevels && game.isAvailable && (
        <div 
          className="modal-overlay"
          onClick={toggleDetails}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={toggleDetails}
              style={{
                position: 'sticky',
                top: '1rem',
                right: '1rem',
                float: 'right',
                background: game.color || '#666',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.5rem',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              ✕
            </button>
            
            <LevelDetails 
              levels={game.levels} 
              gameName={game.name}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GameCard;