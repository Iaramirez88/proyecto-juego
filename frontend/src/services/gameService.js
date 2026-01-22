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
 * Servicio para manejar juegos
 */
export class GameService {
  
  /**
   * Obtener todos los juegos disponibles
   * @param {Object} [filters] - Filtros opcionales
   * @param {string} [filters.category] - Filtrar por categoría
   * @param {string} [filters.difficulty] - Filtrar por dificultad
   * @param {boolean} [filters.active] - Filtrar por juegos activos
   * @returns {Promise<Object>} Lista de juegos
   */
  static async getAllGames(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/games?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los juegos');
    }
  }

  /**
   * Obtener un juego específico por ID
   * @param {string} gameId - ID del juego
   * @returns {Promise<Object>} Datos del juego
   */
  static async getGameById(gameId) {
    try {
      const response = await apiClient.get(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener el juego');
    }
  }

  /**
   * Obtener configuración de un juego para una institución
   * @param {string} gameId - ID del juego
   * @param {string} institutionId - ID de la institución
   * @returns {Promise<Object>} Configuración del juego
   */
  static async getGameConfig(gameId, institutionId) {
    try {
      const response = await apiClient.get(`/games/${gameId}/config/${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game config:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener la configuración del juego');
    }
  }

  /**
   * Obtener todas las categorías de juegos
   * @returns {Promise<Object>} Lista de categorías
   */
  static async getGameCategories() {
    try {
      const response = await apiClient.get('/games/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching game categories:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las categorías');
    }
  }
}

/**
 * Servicio para manejar usuarios y autenticación
 */
export class UserService {
  
  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<Object>} Datos del usuario
   */
  static async getCurrentUser() {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los datos del usuario');
    }
  }

  /**
   * Actualizar perfil del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async updateProfile(userData) {
    try {
      const response = await apiClient.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el perfil');
    }
  }

  /**
   * Obtener usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  static async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener el usuario');
    }
  }
}

/**
 * Utilidades para manejo de autenticación
 */
export class AuthUtils {
  
  /**
   * Obtener token de autenticación del localStorage
   * @returns {string|null} Token o null si no existe
   */
  static getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Obtener datos del usuario del localStorage
   * @returns {Object|null} Datos del usuario o null si no existen
   */
  static getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} true si está autenticado
   */
  static isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  /**
   * Obtener ID del usuario actual
   * @returns {string|null} ID del usuario o null
   */
  static getCurrentUserId() {
    const user = this.getUser();
    return user?.id || null;
  }

  /**
   * Limpiar datos de autenticación
   */
  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

export { apiClient };

const services = { GameService, UserService, AuthUtils };
export default services;