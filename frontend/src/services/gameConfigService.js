import React from 'react';

/**
 * Servicio para interactuar con la API de configuraciones de juegos
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class GameConfigService {
  /**
   * Obtiene el token de autenticación desde localStorage
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Headers comunes para las requests
   */
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  /**
   * Obtiene la configuración específica de un juego para una institución
   * @param {string} gameId - ID del juego
   * @param {string} institutionId - ID de la institución
   * @returns {Promise<Object>} - Configuración del juego
   */
  async getGameConfig(gameId, institutionId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/games/${gameId}/config/${institutionId}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.config;
    } catch (error) {
      console.error('Error obteniendo configuración del juego:', error);
      // Devolver configuración por defecto en caso de error
      return this.getDefaultConfig();
    }
  }

  /**
   * Obtiene juegos activos para una institución
   * @param {string} institutionId - ID de la institución
   * @returns {Promise<Array>} - Lista de juegos activos
   */
  async getActiveGames(institutionId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/institutions/${institutionId}/games/active`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.games;
    } catch (error) {
      console.error('Error obteniendo juegos activos:', error);
      return [];
    }
  }

  /**
   * Configuración por defecto cuando no se puede obtener del backend
   */
  getDefaultConfig() {
    return {
      deviceSettings: {
        mobile: {
          pairsPerRow: 2,
          maxCards: 12,
          cardSize: 'small',
          animationSpeed: 'normal'
        },
        tablet: {
          pairsPerRow: 4,
          maxCards: 16,
          cardSize: 'medium',
          animationSpeed: 'normal'
        },
        desktop: {
          pairsPerRow: 6,
          maxCards: 20,
          cardSize: 'large',
          animationSpeed: 'fast'
        }
      }
    };
  }

  /**
   * Extrae configuración específica para un dispositivo
   * @param {Object} config - Configuración completa del juego
   * @param {string} deviceType - Tipo de dispositivo (mobile, tablet, desktop)
   * @returns {Object} - Configuración específica del dispositivo
   */
  getDeviceConfig(config, deviceType) {
    const deviceSettings = config?.deviceSettings || this.getDefaultConfig().deviceSettings;
    return deviceSettings[deviceType] || deviceSettings.desktop;
  }

  /**
   * Actualiza configuración de juego para una institución (solo admins)
   * @param {string} gameId - ID del juego
   * @param {Object} configData - Datos de configuración
   * @returns {Promise<Object>} - Resultado de la actualización
   */
  async updateGameConfig(gameId, configData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/games/${gameId}/config`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(configData)
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error actualizando configuración del juego:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const gameConfigService = new GameConfigService();

// Hook personalizado para usar el servicio de configuración de juegos
export const useGameConfig = (gameId, institutionId) => {
  const [config, setConfig] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadConfig = async () => {
      if (!gameId || !institutionId) return;
      
      setLoading(true);
      try {
        const gameConfig = await gameConfigService.getGameConfig(gameId, institutionId);
        setConfig(gameConfig);
        setError(null);
      } catch (err) {
        setError(err.message);
        setConfig(gameConfigService.getDefaultConfig());
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [gameId, institutionId]);

  return { config, loading, error };
};

export default gameConfigService;