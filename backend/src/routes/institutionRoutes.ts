import { Router } from 'express';
import { InstitutionController } from '../controllers/institutionController';
import { GameController } from '../controllers/gameController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import { UserRole } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/institutions - Solo ADMIN puede ver todas
router.get('/', requireRole([UserRole.ADMIN]), InstitutionController.getAll);

// POST /api/institutions - Solo ADMIN puede crear
router.post('/', requireRole([UserRole.ADMIN]), InstitutionController.create);

// GET /api/institutions/:id - ADMIN puede ver cualquiera, otros solo su institución
router.get('/:id', InstitutionController.getById);

// GET /api/institutions/:id/stats - Estadísticas de la institución
router.get('/:id/stats', InstitutionController.getStats);

// GET /api/institutions/:institutionId/games/active - Juegos activos de la institución
router.get('/:institutionId/games/active', GameController.getActiveGamesByInstitution);

// PUT /api/institutions/:id - Solo ADMIN
router.put('/:id', requireRole([UserRole.ADMIN]), InstitutionController.update);

// DELETE /api/institutions/:id - Solo ADMIN
router.delete('/:id', requireRole([UserRole.ADMIN]), InstitutionController.delete);

export { router as institutionRoutes };