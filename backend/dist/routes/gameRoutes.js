"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRoutes = void 0;
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
exports.gameRoutes = router;
router.use(authMiddleware_1.authenticateToken);
router.get('/', gameController_1.GameController.getAll);
router.get('/categories', gameController_1.GameController.getCategories);
router.post('/', (0, authMiddleware_1.requireRole)([types_1.UserRole.SUPER_ADMIN]), gameController_1.GameController.create);
router.get('/:id', gameController_1.GameController.getById);
router.put('/:id', (0, authMiddleware_1.requireRole)([types_1.UserRole.SUPER_ADMIN]), gameController_1.GameController.update);
router.put('/:id/toggle', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN]), gameController_1.GameController.toggleGame);
router.post('/:id/config', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN]), gameController_1.GameController.configureForInstitution);
router.get('/:id/config/:institutionId', gameController_1.GameController.getInstitutionConfig);
//# sourceMappingURL=gameRoutes.js.map