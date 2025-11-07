import { Router } from 'express';
import { ProgressController } from '../controllers/progressController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import { UserRole } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// POST /api/progress - Registrar progreso
router.post('/', ProgressController.createProgress);

// GET /api/progress/user/:userId - Progreso de usuario específico
router.get('/user/:userId', ProgressController.getUserProgress);

// GET /api/progress/classroom/:classroomId - Progreso de aula
router.get('/classroom/:classroomId', ProgressController.getClassroomProgress);

// GET /api/progress/stats/user/:userId - Estadísticas de usuario
router.get('/stats/user/:userId', ProgressController.getUserStats);

// PUT /api/progress/:id - Actualizar progreso
router.put('/:id', ProgressController.updateProgress);

// DELETE /api/progress/:id - Eliminar progreso (solo ADMIN)
router.delete('/:id', requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), ProgressController.deleteProgress);

export { router as progressRoutes };