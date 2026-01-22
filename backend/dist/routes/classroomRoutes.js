"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classroomRoutes = void 0;
const express_1 = require("express");
const classroomController_1 = require("../controllers/classroomController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
exports.classroomRoutes = router;
router.use(authMiddleware_1.authenticateToken);
router.get('/', classroomController_1.ClassroomController.getAll);
router.post('/', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN]), classroomController_1.ClassroomController.create);
router.get('/:id', classroomController_1.ClassroomController.getById);
router.put('/:id', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN]), classroomController_1.ClassroomController.update);
router.delete('/:id', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN]), classroomController_1.ClassroomController.delete);
router.post('/:id/students', classroomController_1.ClassroomController.addStudent);
router.get('/:id/stats', classroomController_1.ClassroomController.getStats);
//# sourceMappingURL=classroomRoutes.js.map