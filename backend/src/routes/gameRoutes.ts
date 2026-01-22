import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import { UserRole } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/games - Listar juegos
router.get('/', GameController.getAll);

// GET /api/games/categories - Obtener categorías
router.get('/categories', GameController.getCategories);

// POST /api/games - Crear juego (solo SUPER_ADMIN)
router.post('/', requireRole([UserRole.SUPER_ADMIN]), GameController.create);

// GET /api/games/:id - Ver juego específico
router.get('/:id', GameController.getById);

// PUT /api/games/:id - Actualizar juego (solo SUPER_ADMIN)
router.put('/:id', requireRole([UserRole.SUPER_ADMIN]), GameController.update);

// PUT /api/games/:id/toggle - Activar/desactivar juego
router.put('/:id/toggle', requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), GameController.toggleGame);

// POST /api/games/:id/config - Configurar juego para institución
router.post('/:id/config', requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), GameController.configureForInstitution);

// GET /api/games/:id/config/:institutionId - Ver configuración específica
router.get('/:id/config/:institutionId', GameController.getInstitutionConfig);

export { router as gameRoutes };