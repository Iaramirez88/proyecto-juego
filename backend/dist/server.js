"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const authRoutes_1 = require("./routes/authRoutes");
const institutionRoutes_1 = require("./routes/institutionRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const classroomRoutes_1 = require("./routes/classroomRoutes");
const gameRoutes_1 = require("./routes/gameRoutes");
const progressRoutes_1 = require("./routes/progressRoutes");
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env['PORT'] || 3001;
        this.middlewares();
        this.routes();
        this.errorHandling();
    }
    middlewares() {
        this.app.use((0, helmet_1.default)());
        const allowedOrigins = process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'];
        this.app.use((0, cors_1.default)({
            origin: allowedOrigins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use(rateLimiter_1.rateLimiter);
        if (process.env['NODE_ENV'] === 'development') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        else {
            this.app.use((0, morgan_1.default)('combined'));
        }
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: process.env['NODE_ENV'],
                version: '1.0.0'
            });
        });
    }
    routes() {
        this.app.use('/api/auth', authRoutes_1.authRoutes);
        this.app.use('/api/institutions', institutionRoutes_1.institutionRoutes);
        this.app.use('/api/users', userRoutes_1.userRoutes);
        this.app.use('/api/classrooms', classroomRoutes_1.classroomRoutes);
        this.app.use('/api/games', gameRoutes_1.gameRoutes);
        this.app.use('/api/progress', progressRoutes_1.progressRoutes);
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Route not found',
                message: `Cannot ${req.method} ${req.originalUrl}`,
                timestamp: new Date().toISOString()
            });
        });
    }
    errorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Server running on port ${this.port}`);
            console.log(`🌍 Environment: ${process.env['NODE_ENV']}`);
            console.log(`📊 Health check: http://localhost:${this.port}/health`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map