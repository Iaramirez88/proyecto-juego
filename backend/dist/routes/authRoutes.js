"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
exports.authRoutes = router;
router.post('/register', authController_1.AuthController.register);
router.post('/login', authController_1.AuthController.login);
router.post('/logout', authController_1.AuthController.logout);
router.get('/profile', authMiddleware_1.authenticateToken, authController_1.AuthController.getProfile);
router.put('/profile', authMiddleware_1.authenticateToken, authController_1.AuthController.updateProfile);
//# sourceMappingURL=authRoutes.js.map