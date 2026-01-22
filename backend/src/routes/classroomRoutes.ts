import { Router } from 'express';
import { ClassroomController } from '../controllers/classroomController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import { UserRole } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/classrooms - Listar aulas
router.get('/', ClassroomController.getAll);

// POST /api/classrooms - Crear aula (solo ADMIN y SUPER_ADMIN)
router.post('/', requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), ClassroomController.create);

// GET /api/classrooms/:id - Ver aula específica
router.get('/:id', ClassroomController.getById);

// PUT /api/classrooms/:id - Actualizar aula
router.put('/:id', requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), ClassroomController.update);

// DELETE /api/classrooms/:id - Eliminar aula
router.delete('/:id', requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), ClassroomController.delete);

// POST /api/classrooms/:id/students - Agregar estudiante
router.post('/:id/students', ClassroomController.addStudent);

// GET /api/classrooms/:id/stats - Estadísticas del aula
router.get('/:id/stats', ClassroomController.getStats);

export { router as classroomRoutes };