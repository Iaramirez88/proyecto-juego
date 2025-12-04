import React from 'react';
import '../../assets/styles/level-details.css';

/**
 * Componente para mostrar el desglose de niveles/letras jugadas
 * Muestra puntuación, estrellas y accuracy de cada letra
 */
const LevelDetails = ({ levels, gameName }) => {
  if (!levels || Object.keys(levels).length === 0) {
    return (
      <div className="level-details-empty">
        <span className="empty-icon">📝</span>
        <p>No hay niveles completados aún</p>
      </div>
    );
  }

  // Convertir objeto de niveles a array y ordenar alfabéticamente
  const levelsList = Object.entries(levels)
    .map(([letter, data]) => ({
      letter,
      ...data
    }))
    .sort((a, b) => a.letter.localeCompare(b.letter));

  const renderStars = (stars) => {
    const starsArray = [];
    for (let i = 0; i < 3; i++) {
      starsArray.push(
        <span key={i} className={`mini-star ${i < stars ? 'filled' : 'empty'}`}>
          {i < stars ? '⭐' : '☆'}
        </span>
      );
    }
    return starsArray;
  };

  const getPerformanceClass = (accuracy) => {
    if (accuracy >= 90) return 'excellent';
    if (accuracy >= 70) return 'good';
    if (accuracy >= 50) return 'okay';
    return 'needs-improvement';
  };

  return (
    <div className="level-details-container">
      <div className="level-details-header">
        <h4>📊 Niveles completados de {gameName}</h4>
        <span className="level-count">{levelsList.length} {levelsList.length === 1 ? 'nivel' : 'niveles'}</span>
      </div>
      
      <div className="levels-grid">
        {levelsList.map((level) => (
          <div 
            key={level.letter} 
            className={`level-item ${getPerformanceClass(level.bestAccuracy || level.lastAccuracy || 0)}`}
          >
            {/* Letra principal */}
            <div className="level-letter">
              {level.letter.toUpperCase()}
            </div>

            {/* Información del nivel */}
            <div className="level-info">
              {/* Estrellas */}
              <div className="level-stars">
                {renderStars(level.stars || 0)}
              </div>

              {/* Score */}
              {level.bestScore > 0 && (
                <div className="level-score">
                  <span className="score-icon">🎯</span>
                  <span className="score-value">{level.bestScore}</span>
                </div>
              )}

              {/* Accuracy */}
              {(level.bestAccuracy !== undefined && level.bestAccuracy !== null) && (
                <div className="level-accuracy" title="Tu mejor puntuación en esta letra">
                  <span className="accuracy-icon">✓</span>
                  <span className="accuracy-value">{Math.round(level.bestAccuracy)}%</span>
                  {level.bestAccuracy > (level.lastAccuracy || 0) && (
                    <span style={{ fontSize: '0.7rem', marginLeft: '0.2rem' }}>🏆</span>
                  )}
                </div>
              )}

              {/* Intentos correctos/incorrectos */}
              {level.correctAttempts !== undefined && (
                <div className="level-attempts">
                  <span className="attempts-correct" title="Intentos correctos">
                    ✅ {level.correctAttempts}
                  </span>
                  {level.incorrectAttempts > 0 && (
                    <span className="attempts-incorrect" title="Intentos incorrectos">
                      ❌ {level.incorrectAttempts}
                    </span>
                  )}
                </div>
              )}

              {/* Fecha de última jugada */}
              {level.lastPlayed && (
                <div className="level-date">
                  <span className="date-icon">📅</span>
                  <span className="date-value">
                    {new Date(level.lastPlayed).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Badge de perfección */}
            {level.stars === 3 && (level.bestAccuracy || 0) >= 95 && (
              <div className="perfect-badge">
                <span className="badge-icon">🏆</span>
                <span className="badge-text">¡Perfecto!</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Estadísticas generales */}
      <div className="level-stats-summary">
        <div className="stat-item">
          <span className="stat-label">Promedio aciertos</span>
          <span className="stat-value">
            {Math.round(
              levelsList.reduce((sum, l) => sum + (l.bestAccuracy || l.lastAccuracy || 0), 0) / levelsList.length
            )}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total estrellas</span>
          <span className="stat-value">
            {levelsList.reduce((sum, l) => sum + (l.stars || 0), 0)} ⭐
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mejor puntuación</span>
          <span className="stat-value">
            {Math.max(...levelsList.map(l => l.bestScore || 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LevelDetails;
