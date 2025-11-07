import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import { UserRole } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/users - Listar usuarios
router.get('/', UserController.getAll);

// POST /api/users - Crear usuario (solo ADMIN y SUPER_ADMIN)
router.post('/', requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), UserController.create);

// GET /api/users/:id - Ver usuario específico
router.get('/:id', UserController.getById);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', UserController.update);

// DELETE /api/users/:id - Eliminar usuario (solo ADMIN y SUPER_ADMIN)
router.delete('/:id', requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), UserController.delete);

// GET /api/users/:id/children - Ver hijos del usuario
router.get('/:id/children', UserController.getChildren);

// PUT /api/users/:id/change-password - Cambiar password
router.put('/:id/change-password', UserController.changePassword);

export { router as userRoutes };