/**
 * Servicio de progreso local usando localStorage
 * Funciona sin backend para desarrollo y testing
 */

// Importar iconos del home para consistencia visual
import {
  iconoVocabulario,
  iconoEscucha,
  iconopares,
  iconoOtono,
  iconoEscritura
} from '../utils/imagesResources';

class LocalProgressService {
  constructor() {
    this.storageKey = 'koala_game_progress';
    this.userKey = 'koala_current_user';
    this.initializeStorage();
  }

  /**
   * Inicializar el storage si no existe
   */
  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({}));
    }
    
    // Crear usuario por defecto si no existe
    if (!localStorage.getItem(this.userKey)) {
      const defaultUser = {
        id: 'student-' + Date.now(),
        name: 'Estudiante',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      localStorage.setItem(this.userKey, JSON.stringify(defaultUser));
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.userKey));
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Obtener todo el progreso almacenado
   */
  getAllProgress() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    } catch (error) {
      console.error('Error getting progress:', error);
      return {};
    }
  }

  /**
   * Guardar progreso de un juego
   */
  saveGameProgress(gameData) {
    try {
      const progress = this.getAllProgress();
      const user = this.getCurrentUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      const userId = user.id;
      const gameId = gameData.gameId || 'unknown-game';
      
      // Inicializar usuario si no existe
      if (!progress[userId]) {
        progress[userId] = {
          games: {},
          stats: {
            totalGamesPlayed: 0,
            totalScore: 0,
            totalTimeSpent: 0,
            averageScore: 0,
            gamesCompleted: 0,
            totalStars: 0
          },
          achievements: [],
          lastActivity: new Date().toISOString()
        };
      }

      // Inicializar juego si no existe
      if (!progress[userId].games[gameId]) {
        progress[userId].games[gameId] = {
          attempts: 0,
          bestScore: 0,
          totalScore: 0,
          timeSpent: 0,
          completed: false,
          stars: 0,
          levels: {},
          firstPlayed: new Date().toISOString()
        };
      }

      const gameProgress = progress[userId].games[gameId];
      const level = gameData.level || gameData.additionalData?.level || 'default';

      // Actualizar progreso del juego
      gameProgress.attempts += 1;
      gameProgress.totalScore += gameData.score || 0;
      gameProgress.timeSpent += gameData.timeSpent || 0;
      gameProgress.lastPlayed = new Date().toISOString();

      // Actualizar mejor puntuación
      if (gameData.score > gameProgress.bestScore) {
        gameProgress.bestScore = gameData.score;
      }

      // Actualizar progreso por nivel
      if (!gameProgress.levels[level]) {
        gameProgress.levels[level] = {
          attempts: 0,
          bestScore: 0,
          completed: false,
          stars: 0
        };
      }

      const levelProgress = gameProgress.levels[level];
      levelProgress.attempts += 1;
      
      if (gameData.score > levelProgress.bestScore) {
        levelProgress.bestScore = gameData.score;
      }

      // Marcar como completado si es necesario
      if (gameData.completed || gameData.additionalData?.completed) {
        gameProgress.completed = true;
        levelProgress.completed = true;
      }

      // Calcular estrellas basado en puntuación (0-3 estrellas)
      const stars = this.calculateStars(gameData.score, gameData.maxScore || 100);
      if (stars > levelProgress.stars) {
        levelProgress.stars = stars;
      }
      
      // IMPORTANTE: Actualizar game.stars con el MÁXIMO de estrellas entre todos los niveles
      // Esto asegura que se cuenten las estrellas de todas las vocales (A, E, I, O, U)
      const allLevelStars = Object.values(gameProgress.levels).map(l => l.stars || 0);
      const maxStarsFromLevels = Math.max(...allLevelStars, 0);
      gameProgress.stars = Math.max(maxStarsFromLevels, gameProgress.stars || 0);
      
      console.log(`⭐ Estrellas actualizadas para ${gameId}:`, {
        levelActual: level,
        estrelasNivel: levelProgress.stars,
        todosLosNiveles: gameProgress.levels,
        maxEstrellasNiveles: maxStarsFromLevels,
        estrellasTotalesJuego: gameProgress.stars
      });

      // Actualizar estadísticas globales
      const stats = progress[userId].stats;
      if (gameData.completed || gameData.additionalData?.completed) {
        stats.gamesCompleted += 1;
      }
      stats.totalScore += gameData.score || 0;
      stats.totalTimeSpent += gameData.timeSpent || 0;
      stats.totalGamesPlayed = Object.keys(progress[userId].games).length;

      // Calcular promedio
      const totalAttempts = Object.values(progress[userId].games)
        .reduce((sum, game) => sum + game.attempts, 0);
      stats.averageScore = totalAttempts > 0 ? Math.round(stats.totalScore / totalAttempts) : 0;

      // Calcular total de estrellas - MEJORADO para contar estrellas de todos los niveles
      stats.totalStars = Object.values(progress[userId].games)
        .reduce((sum, game) => {
          // Para cada juego, sumar las estrellas de TODOS sus niveles
          const levelStars = Object.values(game.levels || {})
            .reduce((levelSum, level) => levelSum + (level.stars || 0), 0);
          
          // Retornar el máximo entre la suma de niveles o las estrellas del juego
          return sum + Math.max(levelStars, game.stars || 0);
        }, 0);
      
      console.log(`🌟 Total de estrellas calculado: ${stats.totalStars}`, {
        juegos: Object.keys(progress[userId].games),
        detalleEstrellas: Object.entries(progress[userId].games).map(([id, game]) => ({
          juego: id,
          estrellas: game.stars,
          niveles: Object.entries(game.levels || {}).map(([lvl, data]) => ({
            nivel: lvl,
            estrellas: data.stars
          }))
        }))
      });

      // Verificar logros
      this.checkAchievements(progress[userId]);

      // Guardar en localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(progress));

      // Actualizar última actividad del usuario
      const updatedUser = { ...user, lastActivity: new Date().toISOString() };
      localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
      
      // Disparar evento para notificar cambios en el progreso
      console.log('🔔 Disparando evento progressUpdated para actualizar dashboard');
      window.dispatchEvent(new CustomEvent('progressUpdated', {
        detail: {
          gameId,
          level,
          score: gameData.score,
          stars: gameProgress.stars,
          totalStars: stats.totalStars,
          timestamp: Date.now()
        }
      }));

      return {
        success: true,
        data: {
          gameProgress,
          levelProgress,
          userStats: stats
        }
      };

    } catch (error) {
      console.error('Error saving progress:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calcular estrellas basado en puntuación (0-3)
   */
  calculateStars(score, maxScore = 100) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  }

  /**
   * Obtener progreso de un juego específico
   */
  getGameProgress(gameId, level = null) {
    try {
      const progress = this.getAllProgress();
      const user = this.getCurrentUser();
      
      if (!user || !progress[user.id] || !progress[user.id].games[gameId]) {
        return null;
      }

      const gameProgress = progress[user.id].games[gameId];
      
      if (level && gameProgress.levels[level]) {
        return {
          ...gameProgress,
          levelProgress: gameProgress.levels[level]
        };
      }

      return gameProgress;
    } catch (error) {
      console.error('Error getting game progress:', error);
      return null;
    }
  }

  /**
   * Obtener resumen para el dashboard (versión asíncrona con verificación de juegos activos)
   */
  async getDashboardSummaryAsync() {
    try {
      const progress = this.getAllProgress();
      const user = this.getCurrentUser();
      
      if (!user || !progress[user.id]) {
        return this.getDefaultDashboardData(user);
      }

      const userProgress = progress[user.id];
      const games = await this.formatGamesForDashboardAsync(userProgress.games);

      return {
        userInfo: {
          name: user.name,
          totalStars: userProgress.stats.totalStars,
          achievementBadges: userProgress.achievements || []
        },
        overallProgress: {
          totalGamesPlayed: userProgress.stats.gamesCompleted,
          totalGamesAvailable: this.getAvailableGamesCount(),
          averageScore: userProgress.stats.averageScore,
          totalTimeSpent: userProgress.stats.totalTimeSpent,
          lastPlayedDate: user.lastActivity
        },
        games: games,
        recentAchievements: this.getRecentAchievements(userProgress.achievements)
      };
    } catch (error) {
      console.error('Error getting dashboard summary (async):', error);
      return this.getDefaultDashboardData();
    }
  }

  /**
   * Obtener resumen para el dashboard (versión síncrona como fallback)
   */
  getDashboardSummary() {
    try {
      const progress = this.getAllProgress();
      const user = this.getCurrentUser();
      
      if (!user || !progress[user.id]) {
        return this.getDefaultDashboardData(user);
      }

      const userProgress = progress[user.id];
      const games = this.formatGamesForDashboard(userProgress.games);

      return {
        userInfo: {
          name: user.name,
          totalStars: userProgress.stats.totalStars,
          achievementBadges: userProgress.achievements || []
        },
        overallProgress: {
          totalGamesPlayed: userProgress.stats.gamesCompleted,
          totalGamesAvailable: this.getAvailableGamesCount(),
          averageScore: userProgress.stats.averageScore,
          totalTimeSpent: userProgress.stats.totalTimeSpent,
          lastPlayedDate: user.lastActivity
        },
        games: games,
        recentAchievements: this.getRecentAchievements(userProgress.achievements)
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      return this.getDefaultDashboardData();
    }
  }

  /**
   * Verificar si un juego está activo/disponible
   * Consulta primero la API, luego localStorage, luego fallback a true
   */
  async isGameActive(gameId) {
    console.log(`🔍 Verificando disponibilidad de juego: ${gameId}`);
    
    // PRIORIDAD 1: Verificar configuración local PRIMERO (más rápido y confiable)
    try {
      const adminConfig = JSON.parse(localStorage.getItem('adminGameConfig') || '{}');
      console.log('💾 Configuración local completa:', adminConfig);
      
      if (adminConfig[gameId] !== undefined) {
        const isActive = adminConfig[gameId];
        console.log(`✅ Estado desde localStorage para ${gameId}: ${isActive}`);
        console.log(`🎮 Resultado final: ${gameId} será ${isActive ? 'VISIBLE y COLORIDO' : 'GRIS y BLOQUEADO'}`);
        return isActive;
      }
    } catch (error) {
      console.error('❌ Error leyendo localStorage:', error);
    }
    
    // PRIORIDAD 2: Intentar consultar la API solo si no hay config local
    try {
      const response = await fetch('http://localhost:3001/api/games', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'mock-token'}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const game = data.data.games.find(g => 
          g.name === this.getGameNameById(gameId)
        );
        if (game) {
          console.log(`✅ Estado desde API para ${gameId}: ${game.isActive}`);
          return game.isActive;
        }
      }
    } catch (error) {
      console.log('🔴 No se pudo verificar estado desde API:', error.message);
    }

    // PRIORIDAD 3: Último fallback - todos disponibles
    console.log(`⚠️ No hay configuración para ${gameId}, usando fallback: true`);
    console.log(`🎮 Resultado final: ${gameId} será VISIBLE y COLORIDO (fallback)`);
    return true;
  }

  /**
   * Forzar recarga inmediata de configuración (útil para debug)
   */
  forceConfigReload() {
    console.log('🔄 FORZANDO RECARGA DE CONFIGURACIÓN');
    const currentConfig = localStorage.getItem('adminGameConfig');
    console.log('📋 Config actual:', currentConfig);
    
    // Disparar evento para notificar cambio
    window.dispatchEvent(new CustomEvent('forceConfigReload', {
      detail: { config: currentConfig, timestamp: Date.now() }
    }));
    
    return currentConfig;
  }

  /**
   * Mapear IDs a nombres de juegos para API
   */
  getGameNameById(gameId) {
    const gameNames = {
      'pair-words': 'Encuentra los Pares',
      'fall-module': 'Hojas de Otoño', 
      'vocabulary-game': 'Vocabulario',
      'audio-game': 'Sonidos Divertidos',
      'writing-game': 'Escribir Palabras'
    };
    return gameNames[gameId] || gameId;
  }

  /**
   * Formatear juegos para el dashboard con verificación de disponibilidad
   */
  async formatGamesForDashboardAsync(gamesData = {}) {
    const availableGames = [
      {
        id: 'vocabulary-game',
        name: 'Vocabulario',
        icon: iconoVocabulario,
        color: '#66BB6A',
        route: '/vocabulario/A',
        maxStars: 3
      },
      {
        id: 'audio-game',
        name: 'Escucha',
        icon: iconoEscucha,
        color: '#42A5F5',
        route: '/escucha/A',
        maxStars: 3
      },
      {
        id: 'pair-words',
        name: 'Pares',
        icon: iconopares,
        color: '#FF6B9D',
        route: '/pares/A',
        maxStars: 3
      },
      {
        id: 'fall-module',
        name: 'Otoño',
        icon: iconoOtono,
        color: '#FFA726',
        route: '/otoño/A',
        maxStars: 3
      },
      {
        id: 'writing-game',
        name: 'Escritura',
        icon: iconoEscritura,
        color: '#9C27B0',
        route: '/escritura/A',
        maxStars: 3
      }
    ];

    // Verificar disponibilidad de cada juego
    const gamesWithAvailability = await Promise.all(
      availableGames.map(async (game) => {
        const progress = gamesData[game.id];
        const isActive = await this.isGameActive(game.id);
        
        // Calcular estrellas totales del juego (sumando todos los niveles)
        let totalStars = 0;
        let maxStars = 3; // Default para juegos sin niveles
        let totalScore = 0; // 🎯 Score total sumando todos los niveles
        
        if (progress) {
          // Sumar estrellas de todos los niveles
          const levelStars = Object.values(progress.levels || {})
            .reduce((sum, level) => sum + (level.stars || 0), 0);
          
          // 🎯 Sumar SCORES de todos los niveles
          const levelScores = Object.values(progress.levels || {})
            .reduce((sum, level) => sum + (level.bestScore || 0), 0);
          
          // 🎯 Calcular maxStars basado en el número de niveles
          // Cada nivel tiene máximo 3 estrellas
          const numberOfLevels = Object.keys(progress.levels || {}).length;
          maxStars = numberOfLevels > 0 ? numberOfLevels * 3 : 3;
          
          // Usar el máximo entre la suma de niveles o las estrellas del juego
          totalStars = Math.max(levelStars, progress.stars || 0);
          
          // 🎯 Usar el máximo entre la suma de scores de niveles o el bestScore general
          totalScore = Math.max(levelScores, progress.bestScore || 0);
          
          console.log(`📊 Estrellas y Score para ${game.id}:`, {
            estrellasJuego: progress.stars,
            niveles: progress.levels,
            numeroDeNiveles: numberOfLevels,
            maxStarsCalculado: maxStars,
            estrellasPorNivel: Object.entries(progress.levels || {}).map(([lvl, data]) => ({
              nivel: lvl,
              estrellas: data.stars,
              score: data.bestScore
            })),
            sumaDeNiveles: levelStars,
            sumaDeScores: levelScores,
            totalCalculado: totalStars,
            scoreTotal: totalScore
          });
        }
        
        const gameData = {
          ...game,
          stars: totalStars,
          maxStars: maxStars, // 🎯 Usar maxStars calculado
          lastScore: totalScore, // 🎯 Usar score total de todos los niveles
          isAvailable: isActive,
          attempts: progress?.attempts || 0,
          completed: progress?.completed || false
        };
        
        console.log(`✅ Juego ${game.id} formateado:`, gameData);
        
        return gameData;
      })
    );
    
    console.log('🎮 TODOS los juegos formateados:', gamesWithAvailability);

    return gamesWithAvailability;
  }

  /**
   * Formatear juegos para el dashboard (versión síncrona como fallback)
   */
  formatGamesForDashboard(gamesData = {}) {
    const availableGames = [
      {
        id: 'vocabulary-game',
        name: 'Vocabulario',
        icon: iconoVocabulario,
        color: '#66BB6A',
        route: '/vocabulario/A',
        maxStars: 3
      },
      {
        id: 'audio-game',
        name: 'Escucha',
        icon: iconoEscucha,
        color: '#42A5F5',
        route: '/escucha/A',
        maxStars: 3
      },
      {
        id: 'pair-words',
        name: 'Pares',
        icon: iconopares,
        color: '#FF6B9D',
        route: '/pares/A',
        maxStars: 3
      },
      {
        id: 'fall-module',
        name: 'Otoño',
        icon: iconoOtono,
        color: '#FFA726',
        route: '/otoño/A',
        maxStars: 3
      },
      {
        id: 'writing-game',
        name: 'Escritura',
        icon: iconoEscritura,
        color: '#9C27B0',
        route: '/escritura/A',
        maxStars: 3
      }
    ];

    return availableGames.map(game => {
      const progress = gamesData[game.id];
      
      // Calcular estrellas totales del juego (sumando todos los niveles)
      let totalStars = 0;
      if (progress) {
        // Sumar estrellas de todos los niveles
        const levelStars = Object.values(progress.levels || {})
          .reduce((sum, level) => sum + (level.stars || 0), 0);
        
        // Usar el máximo entre la suma de niveles o las estrellas del juego
        totalStars = Math.max(levelStars, progress.stars || 0);
      }
      
      return {
        ...game,
        stars: totalStars,
        lastScore: progress?.bestScore || 0,
        isAvailable: true,
        attempts: progress?.attempts || 0,
        completed: progress?.completed || false
      };
    });
  }

  /**
   * Obtener datos por defecto del dashboard
   */
  getDefaultDashboardData(user = null) {
    return {
      userInfo: {
        name: user?.name || 'Estudiante',
        totalStars: 0,
        achievementBadges: []
      },
      overallProgress: {
        totalGamesPlayed: 0,
        totalGamesAvailable: this.getAvailableGamesCount(),
        averageScore: 0,
        totalTimeSpent: 0,
        lastPlayedDate: new Date().toISOString()
      },
      games: this.formatGamesForDashboard({}),
      recentAchievements: []
    };
  }

  /**
   * Obtener cantidad de juegos disponibles
   */
  getAvailableGamesCount() {
    return 5; // pair-words, fall-module, vocabulary-game, audio-game, writing-game
  }

  /**
   * Verificar y agregar logros
   */
  checkAchievements(userProgress) {
    const achievements = userProgress.achievements || [];
    const stats = userProgress.stats;

    // Primera estrella
    if (stats.totalStars >= 1 && !achievements.includes('primera-estrella')) {
      achievements.push('primera-estrella');
    }

    // Cinco juegos
    if (stats.gamesCompleted >= 5 && !achievements.includes('cinco-juegos')) {
      achievements.push('cinco-juegos');
    }

    // Perfeccionista (promedio > 90)
    if (stats.averageScore >= 90 && !achievements.includes('perfeccionista')) {
      achievements.push('perfeccionista');
    }

    // Velocista (tiempo promedio bajo)
    const gamesPlayed = Object.keys(userProgress.games).length;
    if (gamesPlayed > 0 && (stats.totalTimeSpent / gamesPlayed) < 60 && !achievements.includes('velocista')) {
      achievements.push('velocista');
    }

    userProgress.achievements = achievements;
  }

  /**
   * Obtener logros recientes
   */
  getRecentAchievements(achievements) {
    // Por ahora retornamos todos, en el futuro podríamos agregar timestamps
    return achievements || [];
  }

  /**
   * Limpiar todo el progreso (para testing)
   */
  clearAllProgress() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userKey);
    this.initializeStorage();
  }

  /**
   * Exportar progreso (para backup)
   */
  exportProgress() {
    return {
      progress: this.getAllProgress(),
      user: this.getCurrentUser(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Importar progreso (para restore)
   */
  importProgress(data) {
    try {
      if (data.progress) {
        localStorage.setItem(this.storageKey, JSON.stringify(data.progress));
      }
      if (data.user) {
        localStorage.setItem(this.userKey, JSON.stringify(data.user));
      }
      return { success: true };
    } catch (error) {
      console.error('Error importing progress:', error);
      return { success: false, error: error.message };
    }
  }
}

// Crear instancia singleton
const localProgressService = new LocalProgressService();

export default localProgressService;