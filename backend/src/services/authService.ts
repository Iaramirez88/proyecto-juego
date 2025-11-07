import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { UserRole } from '../types';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  institutionId?: string;
}

export class AuthService {
  /**
   * Generar token JWT
   */
  static generateToken(payload: JWTPayload): string {
    const secret = config.jwt.secret as string;
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  /**
   * Verificar token JWT
   */
  static verifyToken(token: string): JWTPayload {
    const secret = config.jwt.secret as string;
    return jwt.verify(token, secret) as JWTPayload;
  }

  /**
   * Hash password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.bcrypt.saltRounds);
  }

  /**
   * Comparar password
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generar token de refresh (opcional para futuro)
   */
  static generateRefreshToken(userId: string): string {
    const secret = config.jwt.secret as string;
    return jwt.sign({ userId, type: 'refresh' }, secret, { expiresIn: '7d' });
  }

  /**
   * Validar formato de email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar fortaleza de password
   */
  static isValidPassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}