import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { authRoutes } from './routes/authRoutes';
import { institutionRoutes } from './routes/institutionRoutes';
import { userRoutes } from './routes/userRoutes';
import { classroomRoutes } from './routes/classroomRoutes';
import { gameRoutes } from './routes/gameRoutes';
import { progressRoutes } from './routes/progressRoutes';

// Cargar variables de entorno
dotenv.config();

class Server {
  private app: Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env['PORT'] || 3001;
    
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    // Seguridad
    this.app.use(helmet());
    
    // CORS
    const allowedOrigins = process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'];
    this.app.use(cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Rate limiting
    this.app.use(rateLimiter);

    // Logging
    if (process.env['NODE_ENV'] === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env['NODE_ENV'],
        version: '1.0.0'
      });
    });
  }

  private routes(): void {
    // API Routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/institutions', institutionRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/classrooms', classroomRoutes);
    this.app.use('/api/games', gameRoutes);
    this.app.use('/api/progress', progressRoutes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
      });
    });
  }

  private errorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`🌍 Environment: ${process.env['NODE_ENV']}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
    });
  }
}

export default Server;