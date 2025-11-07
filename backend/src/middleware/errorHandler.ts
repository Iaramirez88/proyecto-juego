import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError, PrismaClientInitializationError } from '@prisma/client/runtime/library';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements ApiError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  console.error(err);

  // Errores de Prisma
  if (err instanceof PrismaClientKnownRequestError) {
    const message = handlePrismaError(err);
    error = new CustomError(message, 400);
  }

  // Error de validación de Prisma
  if (err instanceof PrismaClientValidationError) {
    const message = 'Invalid data provided';
    error = new CustomError(message, 400);
  }

  // Error de conexión de Prisma
  if (err instanceof PrismaClientInitializationError) {
    const message = 'Database connection error';
    error = new CustomError(message, 500);
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new CustomError(message, 401);
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new CustomError(message, 401);
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    const message = 'Invalid input data';
    error = new CustomError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
  });
};

const handlePrismaError = (err: PrismaClientKnownRequestError): string => {
  switch (err.code) {
    case 'P2002':
      return 'Duplicate field value entered';
    case 'P2014':
      return 'Invalid ID';
    case 'P2003':
      return 'Invalid input data';
    case 'P2025':
      return 'Record not found';
    default:
      return 'Database error occurred';
  }
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};