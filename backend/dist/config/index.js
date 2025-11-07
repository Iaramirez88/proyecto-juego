"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env['PORT'] || 3001,
    nodeEnv: process.env['NODE_ENV'] || 'development',
    database: {
        url: process.env['DATABASE_URL'] || 'postgresql://postgres:root@localhost:5433/koala_educativo?schema=public'
    },
    jwt: {
        secret: process.env['JWT_SECRET'] || 'koala-educativo-jwt-secret-2024',
        expiresIn: process.env['JWT_EXPIRES_IN'] || '24h',
        refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d'
    },
    bcrypt: {
        saltRounds: parseInt(process.env['BCRYPT_SALT_ROUNDS'] || '10')
    },
    frontend: {
        url: process.env['FRONTEND_URL'] || 'http://localhost:3000'
    }
};
//# sourceMappingURL=index.js.map