"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const server_1 = __importDefault(require("./server"));
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const gracefulShutdown = async () => {
    console.log('🔄 Graceful shutdown initiated...');
    try {
        await exports.prisma.$disconnect();
        console.log('✅ Database disconnected successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception thrown:', error);
    gracefulShutdown();
});
const main = async () => {
    try {
        await exports.prisma.$connect();
        console.log('✅ Database connected successfully');
        const server = new server_1.default();
        server.listen();
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        await gracefulShutdown();
    }
};
main();
//# sourceMappingURL=index.js.map