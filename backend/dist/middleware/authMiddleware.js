"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.optionalAuth = exports.authorizeInstitution = exports.authorize = exports.authenticateToken = void 0;
const authService_1 = require("../services/authService");
const errorHandler_1 = require("./errorHandler");
const types_1 = require("../types");
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new errorHandler_1.CustomError('Access token is required', 401);
        }
        const decoded = authService_1.AuthService.verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof errorHandler_1.CustomError) {
            next(error);
        }
        else {
            next(new errorHandler_1.CustomError('Invalid or expired token', 401));
        }
    }
};
exports.authenticateToken = authenticateToken;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new errorHandler_1.CustomError('Authentication required', 401);
            }
            if (!allowedRoles.includes(req.user.role)) {
                throw new errorHandler_1.CustomError('Insufficient permissions', 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
const authorizeInstitution = (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorHandler_1.CustomError('Authentication required', 401);
        }
        const { institutionId } = req.params;
        if (req.user.role === types_1.UserRole.SUPER_ADMIN) {
            return next();
        }
        if (req.user.institutionId !== institutionId) {
            throw new errorHandler_1.CustomError('Access denied for this institution', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authorizeInstitution = authorizeInstitution;
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = authService_1.AuthService.verifyToken(token);
            req.user = decoded;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const requireRole = (roles) => {
    return (0, exports.authorize)(...roles);
};
exports.requireRole = requireRole;
//# sourceMappingURL=authMiddleware.js.map