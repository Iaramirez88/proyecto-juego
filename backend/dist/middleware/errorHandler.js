"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.CustomError = void 0;
const library_1 = require("@prisma/client/runtime/library");
class CustomError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error(err);
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        const message = handlePrismaError(err);
        error = new CustomError(message, 400);
    }
    if (err instanceof library_1.PrismaClientValidationError) {
        const message = 'Invalid data provided';
        error = new CustomError(message, 400);
    }
    if (err instanceof library_1.PrismaClientInitializationError) {
        const message = 'Database connection error';
        error = new CustomError(message, 500);
    }
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new CustomError(message, 401);
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new CustomError(message, 401);
    }
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
exports.errorHandler = errorHandler;
const handlePrismaError = (err) => {
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
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map