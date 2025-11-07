import { UserRole } from '../types';
export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    institutionId?: string;
}
export declare class AuthService {
    static generateToken(payload: JWTPayload): string;
    static verifyToken(token: string): JWTPayload;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
    static generateRefreshToken(userId: string): string;
    static isValidEmail(email: string): boolean;
    static isValidPassword(password: string): {
        isValid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=authService.d.ts.map