import Server from './server';
import { PrismaClient } from '@prisma/client';

// Instancia global de Prisma
export const prisma = new PrismaClient();

// Función para manejar el cierre graceful
const gracefulShutdown = async (): Promise<void> => {
  console.log('🔄 Graceful shutdown initiated...');
  
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Manejo de señales de terminación
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  gracefulShutdown();
});

// Inicializar servidor
const main = async (): Promise<void> => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Inicializar servidor
    const server = new Server();
    server.listen();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await gracefulShutdown();
  }
};

main();