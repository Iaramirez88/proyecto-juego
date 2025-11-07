import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const authorize: (...allowedRoles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const authorizeInstitution: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map