"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
exports.userRoutes = router;
router.use(authMiddleware_1.authenticateToken);
router.get('/', userController_1.UserController.getAll);
router.post('/', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN]), userController_1.UserController.create);
router.get('/:id', userController_1.UserController.getById);
router.put('/:id', userController_1.UserController.update);
router.delete('/:id', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN]), userController_1.UserController.delete);
router.get('/:id/children', userController_1.UserController.getChildren);
router.put('/:id/change-password', userController_1.UserController.changePassword);
//# sourceMappingURL=userRoutes.js.map