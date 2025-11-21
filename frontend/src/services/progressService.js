import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Servicio para manejar el progreso de los usuarios
 */
export class ProgressService {
  
  /**
   * Crear o actualizar progreso de un juego
   * @param {Object} progressData - Datos del progreso
   * @param {string} progressData.gameId - ID del juego
   * @param {string} [progressData.activityId] - ID de la actividad (opcional)
   * @param {number} [progressData.score] - Puntuación (0-100)
   * @param {number} [progressData.timeSpent] - Tiempo gastado en segundos
   * @param {boolean} [progressData.completed] - Si el juego se completó
   * @param {Object} [progressData.gameData] - Datos específicos del juego
   * @returns {Promise<Object>} Datos del progreso creado/actualizado
   */
  static async createProgress(progressData) {
    try {
      const response = await apiClient.post('/progress', progressData);
      return response.data;
    } catch (error) {
      console.error('Error creating progress:', error);
      throw new Error(error.response?.data?.message || 'Error al guardar el progreso');
    }
  }

  /**
   * Obtener progreso de un usuario específico
   * @param {string} userId - ID del usuario
   * @param {Object} [filters] - Filtros opcionales
   * @param {string} [filters.gameId] - Filtrar por juego específico
   * @param {string} [filters.categoryId] - Filtrar por categoría
   * @param {boolean} [filters.completed] - Filtrar por completados
   * @param {number} [filters.limit] - Límite de resultados
   * @param {number} [filters.page] - Página de resultados
   * @returns {Promise<Object>} Lista de progreso del usuario
   */
  static async getUserProgress(userId, filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/progress/user/${userId}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener el progreso');
    }
  }

  /**
   * Obtener estadísticas de progreso de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Estadísticas del usuario
   */
  static async getUserStats(userId) {
    try {
      const response = await apiClient.get(`/progress/stats/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las estadísticas');
    }
  }

  /**
   * Obtener progreso de todos los estudiantes de un aula
   * @param {string} classroomId - ID del aula
   * @param {Object} [filters] - Filtros opcionales
   * @param {string} [filters.gameId] - Filtrar por juego específico
   * @param {boolean} [filters.completed] - Filtrar por completados
   * @returns {Promise<Object>} Progreso del aula
   */
  static async getClassroomProgress(classroomId, filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/progress/classroom/${classroomId}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classroom progress:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener el progreso del aula');
    }
  }

  /**
   * Actualizar progreso existente
   * @param {string} progressId - ID del progreso
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Progreso actualizado
   */
  static async updateProgress(progressId, updateData) {
    try {
      const response = await apiClient.put(`/progress/${progressId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el progreso');
    }
  }

  /**
   * Eliminar progreso
   * @param {string} progressId - ID del progreso
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  static async deleteProgress(progressId) {
    try {
      const response = await apiClient.delete(`/progress/${progressId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting progress:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el progreso');
    }
  }

  /**
   * Guardar progreso automático del juego
   * Función helper para simplificar el guardado desde los juegos
   * @param {Object} gameProgressData - Datos del progreso del juego
   * @param {string} gameProgressData.gameId - ID del juego
   * @param {number} gameProgressData.score - Puntuación obtenida
   * @param {number} gameProgressData.timeSpent - Tiempo gastado en segundos
   * @param {boolean} gameProgressData.completed - Si se completó el juego
   * @param {Object} [gameProgressData.gameSpecificData] - Datos específicos del juego
   * @returns {Promise<Object>} Resultado del guardado
   */
  static async saveGameProgress(gameProgressData) {
    const { gameId, score, timeSpent, completed, gameSpecificData, activityId } = gameProgressData;
    
    return this.createProgress({
      gameId,
      activityId,
      score,
      timeSpent,
      completed,
      gameData: gameSpecificData || {}
    });
  }

  /**
   * Obtener resumen de progreso para el dashboard
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Resumen de progreso para el dashboard
   */
  static async getDashboardSummary(userId) {
    try {
      // Obtener estadísticas del usuario
      const statsResponse = await this.getUserStats(userId);
      const stats = statsResponse.data;

      // Obtener progreso reciente
      const recentProgressResponse = await this.getUserProgress(userId, { 
        limit: 10,
        page: 1 
      });
      const recentProgress = recentProgressResponse.data.progress;

      // Procesar datos para el dashboard
      const dashboardData = {
        totalGames: stats.totalGamesPlayed,
        completedGames: stats.totalCompleted,
        averageScore: stats.averageScore || 0,
        totalTimeSpent: stats.totalTimeSpent || 0,
        streakDays: stats.streakDays || 0,
        level: this.calculateLevel(stats.totalCompleted),
        stars: this.calculateStars(stats.averageScore),
        recentGames: recentProgress.map(progress => ({
          id: progress.game.id,
          name: progress.game.name,
          category: progress.game.category.name,
          score: progress.score,
          completed: progress.completed,
          timeSpent: progress.timeSpent,
          playedAt: progress.updatedAt
        })),
        categoryProgress: stats.categoryStats || []
      };

      return { success: true, data: dashboardData };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw new Error('Error al obtener el resumen del dashboard');
    }
  }

  /**
   * Calcular el nivel basado en juegos completados
   * @param {number} completedGames - Número de juegos completados
   * @returns {number} Nivel calculado
   */
  static calculateLevel(completedGames) {
    if (completedGames < 5) return 1;
    if (completedGames < 10) return 2;
    if (completedGames < 20) return 3;
    if (completedGames < 35) return 4;
    if (completedGames < 50) return 5;
    return Math.min(10, Math.floor(completedGames / 10) + 1);
  }

  /**
   * Calcular estrellas basado en la puntuación promedio
   * @param {number} averageScore - Puntuación promedio
   * @returns {number} Número de estrellas (1-5)
   */
  static calculateStars(averageScore) {
    if (averageScore >= 90) return 5;
    if (averageScore >= 80) return 4;
    if (averageScore >= 70) return 3;
    if (averageScore >= 60) return 2;
    return averageScore > 0 ? 1 : 0;
  }
}

export default ProgressService;