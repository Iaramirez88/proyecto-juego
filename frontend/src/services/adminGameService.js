/**
 * Servicio para interactuar con la API de administración de juegos
 */

import { getDefaultGameActive, getDefaultGameVisible } from "../config/adminGameDefaults";

const API_BASE_URL = 'http://localhost:3001/api';

class AdminGameService {
  /**
   * Verificar conectividad con el backend
   * @returns {Promise<boolean>} true si conectado, false si offline
   */
  async checkConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      console.log('🟢 Conexión backend OK');
      return response.ok;
    } catch (error) {
      console.log('🔴 Backend no disponible, usando datos locales');
      return false;
    }
  }

  /**
   * Obtener token de autenticación desde localStorage
   */
  getAuthToken() {
    const token = localStorage.getItem('authToken');
    // Solo retornar token si existe y no es mock
    return token && token !== 'mock-admin-token' ? token : null;
  }

  /**
   * Headers comunes para las requests
   */
  getHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Obtener todos los juegos para administración
   */
  async getAllGames() {
    // Si no hay token válido, usar datos locales directamente
    const token = this.getAuthToken();
    if (!token) {
      console.log('🔧 Sin token de autenticación, usando datos locales');
      return this.getMockGames();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        // Si hay error de autenticación, usar datos mock
        if (response.status === 401 || response.status === 403) {
          console.warn('⚠️ Sin autenticación válida, usando datos locales');
          return this.getMockGames();
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data.games.map(game => ({
          id: game.id,
          name: game.name,
          description: game.description || '',
          isActive: game.isActive,
          difficulty: game.difficulty,
          category: game.category || { name: 'General', color: '#666' },
          minAge: game.minAge,
          maxAge: game.maxAge,
          estimatedDuration: game.estimatedDuration
        }));
      } else {
        throw new Error(data.message || 'Error al obtener juegos');
      }

    } catch (error) {
      console.error('Error fetching games:', error);
      
      // Si falla la conexión, usar datos mock
      console.warn('📦 Conexión falló, usando datos locales');
      return this.getMockGames();
    }
  }

  /**
   * Toggle del estado de un juego (activar/desactivar)
   */
  async toggleGame(gameId) {
    // Si no hay token válido, usar toggle local directamente
    const token = this.getAuthToken();
    if (!token) {
      console.log('🔧 Sin token, usando toggle local');
      return this.toggleGameLocal(gameId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/games/${gameId}/toggle`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        // Si hay error de autenticación o conexión, usar toggle local
        if (response.status === 401 || response.status === 403) {
          console.warn('⚠️ Sin autenticación válida, usando toggle local');
          return this.toggleGameLocal(gameId);
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Actualizar configuración local para sincronización
        this.updateLocalGameConfig(gameId, data.data.game.isActive);
        
        console.log('✅ Toggle exitoso desde API:', data.message);
        return data;
      } else {
        throw new Error(data.message || 'Error al cambiar estado del juego');
      }

    } catch (error) {
      console.error('Error toggling game API:', error);
      
      // En caso de error, usar toggle local
      console.warn('📦 Error en API, usando toggle local');
      return this.toggleGameLocal(gameId);
    }
  }
  /**
   * Toggle local cuando API no está disponible
   */
  toggleGameLocal(gameId) {
    try {
      const config = JSON.parse(localStorage.getItem('adminGameConfig') || '{}');
      const localGameId = this.mapApiGameIdToLocal(gameId);
      
      // Obtener estado actual (por defecto según configuración global)
      const currentState = config[localGameId] !== undefined
        ? config[localGameId]
        : getDefaultGameActive(localGameId);
      const newState = !currentState;
      
      // Actualizar configuración
      config[localGameId] = newState;
      localStorage.setItem('adminGameConfig', JSON.stringify(config));
      
      console.log('💾 Toggle local exitoso para', localGameId, ':', newState);
      console.log('📢 Config actualizada:', config);
      
      // Disparar evento personalizado para notificar cambio
      window.dispatchEvent(new CustomEvent('adminConfigChanged', {
        detail: { gameId: localGameId, isActive: newState, fullConfig: config }
      }));
      
      return {
        success: true,
        message: `Juego ${newState ? 'activado' : 'desactivado'} localmente`,
        data: { game: { id: gameId, isActive: newState } }
      };
    } catch (error) {
      console.error('Error en toggle local:', error);
      return {
        success: false,
        message: 'Error en configuración local'
      };
    }
  }

  /**
   * Toggle de visibilidad (mostrar/ocultar) de un juego en el dashboard.
   * Implementación local: persiste en localStorage y notifica por evento.
   */
  async toggleGameVisibility(gameId) {
    return this.toggleGameVisibilityLocal(gameId);
  }

  /**
   * Toggle local de visibilidad para que un juego no aparezca en el dashboard.
   * Clave: adminGameVisibilityConfig[localGameId] = boolean (true=mostrar)
   */
  toggleGameVisibilityLocal(gameId) {
    try {
      const visibilityConfig = JSON.parse(localStorage.getItem('adminGameVisibilityConfig') || '{}');
      const localGameId = this.mapApiGameIdToLocal(gameId);

      const currentVisible = visibilityConfig[localGameId] !== undefined
        ? visibilityConfig[localGameId]
        : getDefaultGameVisible(localGameId);
      const newVisible = !currentVisible;

      visibilityConfig[localGameId] = newVisible;
      localStorage.setItem('adminGameVisibilityConfig', JSON.stringify(visibilityConfig));

      console.log('👁️ Visibilidad actualizada localmente para', localGameId, ':', newVisible);

      window.dispatchEvent(new CustomEvent('adminConfigChanged', {
        detail: { gameId: localGameId, isVisible: newVisible, visibilityConfig }
      }));

      return {
        success: true,
        message: `Juego ${newVisible ? 'mostrado' : 'ocultado'} en el dashboard` ,
        data: { game: { id: gameId, isVisible: newVisible } }
      };
    } catch (error) {
      console.error('Error en toggle visibilidad local:', error);
      return {
        success: false,
        message: 'Error guardando visibilidad en configuración local'
      };
    }
  }

  /**
   * Actualizar configuración local de juegos
   */
  updateLocalGameConfig(gameId, isActive) {
    try {
      const config = JSON.parse(localStorage.getItem('adminGameConfig') || '{}');
      const localGameId = this.mapApiGameIdToLocal(gameId);
      
      config[localGameId] = isActive;
      localStorage.setItem('adminGameConfig', JSON.stringify(config));
      
      console.log('💾 Configuración local actualizada:', localGameId, '=', isActive);
    } catch (error) {
      console.error('Error actualizando config local:', error);
    }
  }

  /**
   * Mapear ID de API a ID local para compatibilidad
   */
  mapApiGameIdToLocal(apiGameId) {
    // Primero verificar si ya es un ID local válido
    const localIds = ['pair-words', 'fall-module', 'vocabulary-game', 'audio-game', 'writing-game', 'armar'];
    if (localIds.includes(apiGameId)) {
      return apiGameId;
    }

    // Mapeo para IDs numéricos de mock data (en el nuevo orden)
    const numericIdMap = {
      '3': 'vocabulary-game',
      '4': 'audio-game',
      '1': 'pair-words',
      '2': 'fall-module',
      '5': 'writing-game',
      '6': 'armar'
    };

    // Mapeo por nombre para casos de API real
    const nameMap = {
      'Pares': 'pair-words',
      'Otoño': 'fall-module',
      'Vocabulario': 'vocabulary-game',
      'Escucha': 'audio-game',
      'Escritura': 'writing-game',
      'Armar': 'armar'
    };
    
    // Intentar mapeo numérico primero
    if (numericIdMap[apiGameId]) {
      console.log(`🔄 Mapeando ID ${apiGameId} -> ${numericIdMap[apiGameId]}`);
      return numericIdMap[apiGameId];
    }
    
    // Intentar mapeo por nombre
    if (nameMap[apiGameId]) {
      console.log(`🔄 Mapeando nombre "${apiGameId}" -> ${nameMap[apiGameId]}`);
      return nameMap[apiGameId];
    }

    // Buscar en mock data y mapear por nombre
    const mockGame = this.findMockGame(apiGameId);
    if (mockGame && nameMap[mockGame.name]) {
      console.log(`🔄 Mapeando mock "${mockGame.name}" -> ${nameMap[mockGame.name]}`);
      return nameMap[mockGame.name];
    }
    
    console.warn(`⚠️ No se pudo mapear ID: ${apiGameId}`);
    return apiGameId;
  }

  /**
   * Datos mock para desarrollo/demo con estado dinámico desde localStorage
   */
  getMockGames() {
    // Obtener configuración actual de localStorage
    const config = JSON.parse(localStorage.getItem('adminGameConfig') || '{}');
    const visibility = JSON.parse(localStorage.getItem('adminGameVisibilityConfig') || '{}');
    
    console.log('📦 Configuración leída de localStorage:', config);
    
    const mockGames = [
      {
        id: '3',
        name: 'Vocabulario',
        description: 'Arrastra palabras a su lugar correcto',
        isActive: config['vocabulary-game'] !== undefined ? config['vocabulary-game'] : getDefaultGameActive('vocabulary-game'),
        isVisible: visibility['vocabulary-game'] !== undefined ? visibility['vocabulary-game'] : true,
        category: { name: 'Palabras', color: '#66BB6A' },
        difficulty: 'MEDIUM',
        minAge: 6,
        maxAge: 10,
        estimatedDuration: 12
      },
      {
        id: '4',
        name: 'Escucha', 
        description: 'Reconocimiento de sonidos y letras',
        isActive: config['audio-game'] !== undefined ? config['audio-game'] : getDefaultGameActive('audio-game'),
        isVisible: visibility['audio-game'] !== undefined ? visibility['audio-game'] : getDefaultGameVisible('audio-game'),
        category: { name: 'Audio', color: '#42A5F5' },
        difficulty: 'EASY',
        minAge: 4,
        maxAge: 8,
        estimatedDuration: 15
      },
      {
        id: '1',
        name: 'Pares',
        description: 'Juego de memoria para encontrar pares de cartas',
        isActive: config['pair-words'] !== undefined ? config['pair-words'] : getDefaultGameActive('pair-words'),
        isVisible: visibility['pair-words'] !== undefined ? visibility['pair-words'] : getDefaultGameVisible('pair-words'),
        category: { name: 'Memoria', color: '#FF6B9D' },
        difficulty: 'EASY',
        minAge: 4,
        maxAge: 8,
        estimatedDuration: 10
      },
      {
        id: '2', 
        name: 'Otoño',
        description: 'Reconocimiento de letras con hojas que caen',
        isActive: config['fall-module'] !== undefined ? config['fall-module'] : getDefaultGameActive('fall-module'),
        isVisible: visibility['fall-module'] !== undefined ? visibility['fall-module'] : getDefaultGameVisible('fall-module'),
        category: { name: 'Letras', color: '#FFA726' },
        difficulty: 'EASY',
        minAge: 5,
        maxAge: 9,
        estimatedDuration: 8
      },
      {
        id: '5',
        name: 'Escritura',
        description: 'Completa palabras letra por letra',
        isActive: config['writing-game'] !== undefined ? config['writing-game'] : getDefaultGameActive('writing-game'),
        isVisible: visibility['writing-game'] !== undefined ? visibility['writing-game'] : getDefaultGameVisible('writing-game'),
        category: { name: 'Escritura', color: '#9C27B0' },
        difficulty: 'MEDIUM',
        minAge: 6,
        maxAge: 12,
        estimatedDuration: 20
      },
      {
        id: '6',
        name: 'Armar',
        description: 'Arma la figura con piezas (puzzle)',
        isActive: config['armar'] !== undefined ? config['armar'] : getDefaultGameActive('armar'),
        isVisible: visibility['armar'] !== undefined ? visibility['armar'] : getDefaultGameVisible('armar'),
        category: { name: 'Puzzle', color: '#5C7CFA' },
        difficulty: 'EASY',
        minAge: 4,
        maxAge: 9,
        estimatedDuration: 10
      }
    ];
    
    console.log('🎮 Estados de juegos actualizados:', mockGames.map(g => ({ 
      id: g.id, 
      name: g.name, 
      isActive: g.isActive 
    })));
    
    return mockGames;
  }

  /**
   * Buscar juego mock por ID (para simular toggle)
   */
  findMockGame(gameId) {
    return this.getMockGames().find(game => game.id === gameId);
  }

  /**
   * Obtener estadísticas de juegos
   */
  async getGameStats() {
    try {
      const games = await this.getAllGames();
      
      return {
        total: games.length,
        active: games.filter(g => g.isActive).length,
        inactive: games.filter(g => !g.isActive).length,
        byDifficulty: {
          easy: games.filter(g => g.difficulty === 'EASY').length,
          medium: games.filter(g => g.difficulty === 'MEDIUM').length,
          hard: games.filter(g => g.difficulty === 'HARD').length
        }
      };
    } catch (error) {
      console.error('Error getting game stats:', error);
      return {
        total: 5,
        active: 3,
        inactive: 2,
        byDifficulty: { easy: 3, medium: 2, hard: 0 }
      };
    }
  }
}

// Crear instancia singleton
const adminGameService = new AdminGameService();

// También exportar métodos individuales para mayor flexibilidad
export const checkConnection = () => adminGameService.checkConnection();
export const getAllGames = () => adminGameService.getAllGames();
export const toggleGame = (gameId) => adminGameService.toggleGame(gameId);
export const toggleGameVisibility = (gameId) => adminGameService.toggleGameVisibility(gameId);
export const getGameStats = () => adminGameService.getGameStats();

export default adminGameService;