import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { CustomError } from './errorHandler';
import { AuthenticatedRequest, UserRole } from '../types';

/**
 * Middleware de autenticación JWT
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new CustomError('Access token is required', 401);
    }

    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError('Invalid or expired token', 401));
    }
  }
};

/**
 * Middleware de autorización por rol
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new CustomError('Authentication required', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new CustomError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware para verificar propiedad de institución
 */
export const authorizeInstitution = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    const { institutionId } = req.params;
    
    // Super admin puede acceder a cualquier institución
    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    // Admin y Tutor solo pueden acceder a su institución
    if (req.user.institutionId !== institutionId) {
      throw new CustomError('Access denied for this institution', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware opcional de autenticación (para endpoints públicos/privados)
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = AuthService.verifyToken(token);
      req.user = decoded;
    }
    
    // Continúa sin importar si hay token o no
    next();
  } catch (error) {
    // Si hay error en el token, continúa sin user
    next();
  }
};

/**
 * Helper function para crear middleware de roles específicos
 */
export const requireRole = (roles: UserRole[]) => {
  return authorize(...roles);
};