import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
}

interface ServerConfig {
  port: number;
  nodeEnv: string;
  allowedOrigins: string[];
}

interface AppConfig {
  database: DatabaseConfig;
  jwt: JWTConfig;
  server: ServerConfig;
}

// Validar variables de entorno requeridas
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const config: AppConfig = {
  database: {
    url: process.env['DATABASE_URL']!,
    host: process.env['POSTGRES_HOST'] || 'localhost',
    port: parseInt(process.env['POSTGRES_PORT'] || '5432'),
    database: process.env['POSTGRES_DB']!,
    username: process.env['POSTGRES_USER']!,
    password: process.env['POSTGRES_PASSWORD']!
  },
  jwt: {
    secret: process.env['JWT_SECRET']!,
    expiresIn: process.env['JWT_EXPIRES_IN'] || '24h'
  },
  server: {
    port: parseInt(process.env['PORT'] || '3001'),
    nodeEnv: process.env['NODE_ENV'] || 'development',
    allowedOrigins: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000']
  }
};

export default config;