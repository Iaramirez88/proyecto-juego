import { Request } from 'express';

// Extender Request para incluir usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
    institutionId?: string;
  };
}

// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TUTOR = 'TUTOR',
  CHILD = 'CHILD'
}

export enum InstitutionType {
  SCHOOL = 'SCHOOL',
  HOME = 'HOME'
}

export enum GameDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum ActivityStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum AchievementType {
  COMPLETION = 'COMPLETION',
  PERFORMANCE = 'PERFORMANCE',
  CONSISTENCY = 'CONSISTENCY',
  SPECIAL = 'SPECIAL'
}

// Interfaces para requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institutionId?: string;
}

export interface CreateInstitutionRequest {
  name: string;
  type: InstitutionType;
  address?: string;
  phone?: string;
  email?: string;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
}

export interface CreateGameRequest {
  name: string;
  description?: string;
  difficulty: GameDifficulty;
  categoryId: string;
  minAge: number;
  maxAge: number;
  estimatedDuration: number;
  instructions: string;
  config: Record<string, any>;
}

// Interfaces para responses
export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    institutionId?: string;
  };
  token: string;
  expiresIn: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Utilidades de paginación
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}