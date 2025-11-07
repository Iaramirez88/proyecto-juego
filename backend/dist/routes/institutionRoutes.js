"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.institutionRoutes = void 0;
const express_1 = require("express");
const institutionController_1 = require("../controllers/institutionController");
const gameController_1 = require("../controllers/gameController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
exports.institutionRoutes = router;
router.use(authMiddleware_1.authenticateToken);
router.get('/', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN]), institutionController_1.InstitutionController.getAll);
router.post('/', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN]), institutionController_1.InstitutionController.create);
router.get('/:id', institutionController_1.InstitutionController.getById);
router.get('/:id/stats', institutionController_1.InstitutionController.getStats);
router.get('/:institutionId/games/active', gameController_1.GameController.getActiveGamesByInstitution);
router.put('/:id', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN]), institutionController_1.InstitutionController.update);
router.delete('/:id', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN]), institutionController_1.InstitutionController.delete);
//# sourceMappingURL=institutionRoutes.js.map