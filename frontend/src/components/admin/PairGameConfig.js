import React, { useState, useEffect } from 'react';
import gameConfigService from '../../services/gameConfigService';
import './PairGameConfig.css';

const PairGameConfig = ({ onClose }) => {
  const [config, setConfig] = useState(null);
  const [totalPairs, setTotalPairs] = useState(4); // Mínimo 2 pares
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Cargar configuración actual
    const currentConfig = gameConfigService.getLocalConfig('pair-words');
    setConfig(currentConfig);
    setTotalPairs(currentConfig.totalPairs || 4);
  }, []);

  const handleSave = () => {
    if (totalPairs < 2) {
      alert('⚠️ El mínimo son 2 pares (4 cartas)');
      return;
    }

    setSaving(true);
    
    const newConfig = {
      ...config,
      totalPairs: totalPairs
    };

    const success = gameConfigService.saveLocalConfig('pair-words', newConfig);
    
    if (success) {
      alert(`✅ Configuración guardada: ${totalPairs} pares (${totalPairs * 2} cartas)`);
      
      // Disparar evento para que otros componentes se actualicen
      window.dispatchEvent(new CustomEvent('pairGameConfigChanged', { 
        detail: { totalPairs } 
      }));
      
      if (onClose) onClose();
    } else {
      alert('❌ Error al guardar la configuración');
    }
    
    setSaving(false);
  };

  if (!config) {
    return <div className="pair-config-loading">Cargando configuración...</div>;
  }

  return (
    <div className="pair-game-config">
      <div className="config-header">
        <h2>⚙️ Configuración - Juego de Pares</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="config-content">
        <div className="config-section">
          <label className="config-label">
            <span className="label-text">Cantidad de pares:</span>
            <span className="label-hint">(Mínimo: 2 pares = 4 cartas)</span>
          </label>
          
          <div className="input-group">
            <button 
              className="btn-decrement"
              onClick={() => setTotalPairs(Math.max(2, totalPairs - 1))}
              disabled={totalPairs <= 2}
            >
              −
            </button>
            
            <input
              type="number"
              className="pair-input"
              min="2"
              max="12"
              value={totalPairs}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 2;
                setTotalPairs(Math.max(2, Math.min(12, value)));
              }}
            />
            
            <button 
              className="btn-increment"
              onClick={() => setTotalPairs(Math.min(12, totalPairs + 1))}
              disabled={totalPairs >= 12}
            >
              +
            </button>
          </div>

          <div className="config-info">
            <div className="info-item">
              <span className="info-label">Pares:</span>
              <span className="info-value">{totalPairs}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total de cartas:</span>
              <span className="info-value">{totalPairs * 2}</span>
            </div>
          </div>
        </div>

        <div className="config-preview">
          <h3>Vista previa del tablero ({totalPairs * 2} cartas)</h3>
          <div className="preview-grid">
            {Array.from({ length: totalPairs * 2 }).map((_, i) => (
              <div key={i} className="preview-card">🃏</div>
            ))}
          </div>
        </div>
      </div>

      <div className="config-footer">
        <button className="btn-cancel" onClick={onClose}>
          Cancelar
        </button>
        <button 
          className="btn-save" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
};

export default PairGameConfig;
