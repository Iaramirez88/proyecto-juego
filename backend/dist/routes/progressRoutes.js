"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressRoutes = void 0;
const express_1 = require("express");
const progressController_1 = require("../controllers/progressController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
exports.progressRoutes = router;
router.use(authMiddleware_1.authenticateToken);
router.post('/', progressController_1.ProgressController.createProgress);
router.get('/user/:userId', progressController_1.ProgressController.getUserProgress);
router.get('/classroom/:classroomId', progressController_1.ProgressController.getClassroomProgress);
router.get('/stats/user/:userId', progressController_1.ProgressController.getUserStats);
router.put('/:id', progressController_1.ProgressController.updateProgress);
router.delete('/:id', (0, authMiddleware_1.requireRole)([types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN]), progressController_1.ProgressController.deleteProgress);
//# sourceMappingURL=progressRoutes.js.map