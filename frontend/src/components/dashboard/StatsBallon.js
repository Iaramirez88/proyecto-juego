import React from 'react';

const StatsBallon = ({ icon, value, label, color }) => {
  return (
    <div className="stats-balloon">
      <div 
        className="balloon-container"
        style={{ backgroundColor: color }}
      >
        {/* Icono principal */}
        <div className="balloon-icon">
          <span className="icon-emoji">{icon}</span>
        </div>

        {/* Valor principal */}
        <div className="balloon-value">
          {value}
        </div>

        {/* Etiqueta descriptiva */}
        <div className="balloon-label">
          {label}
        </div>

        {/* Cuerda del globo */}
        <div className="balloon-string"></div>
      </div>

      {/* Efectos flotantes */}
      <div className="balloon-effects">
        <span className="float-particle">✨</span>
      </div>
    </div>
  );
};

export default StatsBallon;