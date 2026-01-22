"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const authService_1 = require("../services/authService");
const types_1 = require("../types");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');
    try {
        console.log('📋 Creando planes...');
        const basicPlan = await prisma.plan.create({
            data: {
                name: 'Plan Básico',
                planName: 'Plan Básico',
                planType: 'BASIC',
                minStudents: 1,
                maxStudents: 50,
                priceMonth: 29.99,
                description: 'Plan básico para instituciones pequeñas',
                features: {
                    games: 10,
                    reports: 'básicos',
                    support: 'email',
                    customization: false
                }
            }
        });
        const premiumPlan = await prisma.plan.create({
            data: {
                name: 'Plan Premium',
                planName: 'Plan Premium',
                planType: 'PREMIUM',
                minStudents: 50,
                maxStudents: 200,
                priceMonth: 79.99,
                description: 'Plan premium para instituciones medianas',
                features: {
                    games: 25,
                    reports: 'avanzados',
                    support: 'chat y email',
                    customization: true
                }
            }
        });
        const enterprisePlan = await prisma.plan.create({
            data: {
                name: 'Plan Enterprise',
                planName: 'Plan Enterprise',
                planType: 'ENTERPRISE',
                minStudents: 200,
                maxStudents: null,
                priceMonth: 149.99,
                description: 'Plan enterprise para grandes instituciones',
                features: {
                    games: 'ilimitados',
                    reports: 'personalizados',
                    support: '24/7',
                    customization: true,
                    api: true
                }
            }
        });
        console.log('🏢 Creando instituciones...');
        const demoInstitution = await prisma.institution.create({
            data: {
                name: 'Colegio Demo Koala',
                type: 'SCHOOL',
                address: 'Calle Educación 123, Ciudad Demo',
                phone: '+1234567890',
                email: 'demo@koalaeducativo.com',
                website: 'https://demo.koalaeducativo.com'
            }
        });
        console.log('👥 Creando usuarios...');
        const adminPassword = await authService_1.AuthService.hashPassword('admin123');
        const tutorPassword = await authService_1.AuthService.hashPassword('tutor123');
        const superAdmin = await prisma.user.create({
            data: {
                email: 'admin@koalaeducativo.com',
                password: adminPassword,
                fullName: 'Administrador Principal',
                role: types_1.UserRole.SUPER_ADMIN,
                isActive: true
            }
        });
        const admin = await prisma.user.create({
            data: {
                email: 'director@demodemo.edu',
                password: adminPassword,
                fullName: 'Director del Colegio',
                role: types_1.UserRole.ADMIN,
                institutionId: demoInstitution.id,
                isActive: true
            }
        });
        const tutor1 = await prisma.user.create({
            data: {
                email: 'maria.garcia@demo.edu',
                password: tutorPassword,
                fullName: 'María García',
                role: types_1.UserRole.TUTOR,
                institutionId: demoInstitution.id,
                isActive: true
            }
        });
        const tutor2 = await prisma.user.create({
            data: {
                email: 'juan.perez@demo.edu',
                password: tutorPassword,
                fullName: 'Juan Pérez',
                role: types_1.UserRole.TUTOR,
                institutionId: demoInstitution.id,
                isActive: true
            }
        });
        await prisma.institution.update({
            where: { id: demoInstitution.id },
            data: { createdBy: superAdmin.id }
        });
        console.log('🏫 Creando aulas...');
        const classroom1 = await prisma.classroom.create({
            data: {
                name: 'Aula Infantil A',
                description: 'Aula para niños de 4-6 años',
                institutionId: demoInstitution.id,
                teacherId: tutor1.id,
                gradeLevel: 'Preescolar',
                isActive: true
            }
        });
        const classroom2 = await prisma.classroom.create({
            data: {
                name: 'Primero Básico',
                description: 'Primer año de educación básica',
                institutionId: demoInstitution.id,
                teacherId: tutor2.id,
                gradeLevel: '1ro Básico',
                isActive: true
            }
        });
        console.log('🎮 Creando categorías de juegos...');
        const categoryLenguaje = await prisma.gameCategory.create({
            data: {
                name: 'Lenguaje y Comunicación',
                description: 'Juegos enfocados en desarrollo del lenguaje, lectura y escritura',
                color: '#FF6B6B',
                iconUrl: '📚',
                isActive: true
            }
        });
        const categoryMath = await prisma.gameCategory.create({
            data: {
                name: 'Matemáticas',
                description: 'Juegos de números, operaciones y lógica matemática',
                color: '#4ECDC4',
                iconUrl: '🔢',
                isActive: true
            }
        });
        const categoryMemory = await prisma.gameCategory.create({
            data: {
                name: 'Memoria y Concentración',
                description: 'Juegos para desarrollar memoria visual y concentración',
                color: '#45B7D1',
                iconUrl: '🧠',
                isActive: true
            }
        });
        const categoryMotor = await prisma.gameCategory.create({
            data: {
                name: 'Coordinación Motora',
                description: 'Juegos para desarrollar coordinación y habilidades motoras finas',
                color: '#96CEB4',
                iconUrl: '✋',
                isActive: true
            }
        });
        console.log('🎯 Creando juegos...');
        const pairGame = await prisma.game.create({
            data: {
                name: 'Pingui Palabras - Encuentra los Pares',
                description: 'Juego de memoria donde los niños deben encontrar pares de cartas con palabras e imágenes relacionadas',
                difficulty: types_1.GameDifficulty.EASY,
                minAge: 4,
                maxAge: 8,
                estimatedDuration: 10,
                instructions: 'Haz clic en las cartas para voltearlas y encuentra los pares que coincidan. Memoriza las posiciones para encontrar todas las parejas.',
                config: {
                    cardTypes: ['word-image', 'image-image', 'word-word'],
                    themes: ['animales', 'colores', 'números', 'letras', 'formas'],
                    levels: {
                        easy: { cards: 8, timeLimit: 300 },
                        medium: { cards: 12, timeLimit: 240 },
                        hard: { cards: 16, timeLimit: 180 }
                    },
                    scoring: {
                        pairFound: 100,
                        timeBonus: 10,
                        attemptsRange: { min: 50, max: 200 }
                    },
                    deviceSettings: {
                        mobile: {
                            cardSize: 'small',
                            animationSpeed: 'normal',
                            maxCards: 12,
                            showHints: true
                        },
                        tablet: {
                            cardSize: 'medium',
                            animationSpeed: 'normal',
                            maxCards: 16,
                            showHints: true
                        },
                        desktop: {
                            cardSize: 'large',
                            animationSpeed: 'fast',
                            maxCards: 20,
                            showHints: false
                        }
                    }
                },
                thumbnailUrl: 'https://example.com/pair-game-thumb.jpg',
                categoryId: categoryMemory.id,
                isActive: true
            }
        });
        const wordGame = await prisma.game.create({
            data: {
                name: 'Construye Palabras',
                description: 'Arrastra las letras para formar palabras correctas',
                difficulty: types_1.GameDifficulty.MEDIUM,
                minAge: 5,
                maxAge: 10,
                estimatedDuration: 15,
                instructions: 'Arrastra las letras al lugar correcto para formar la palabra que describe la imagen mostrada.',
                config: {
                    wordLengths: [3, 4, 5, 6],
                    categories: ['animales', 'colores', 'objetos'],
                    hints: true,
                    scrambleType: 'random'
                },
                categoryId: categoryLenguaje.id,
                isActive: true
            }
        });
        const mathGame = await prisma.game.create({
            data: {
                name: 'Suma Divertida',
                description: 'Resuelve operaciones matemáticas básicas de forma divertida',
                difficulty: types_1.GameDifficulty.EASY,
                minAge: 5,
                maxAge: 9,
                estimatedDuration: 12,
                instructions: 'Observa la operación matemática y selecciona la respuesta correcta entre las opciones.',
                config: {
                    operations: ['suma', 'resta'],
                    numberRange: { min: 1, max: 20 },
                    multipleChoice: true,
                    visualAids: true
                },
                categoryId: categoryMath.id,
                isActive: true
            }
        });
        console.log('👶 Creando estudiantes...');
        const studentPassword = await authService_1.AuthService.hashPassword('student123');
        const students = [
            { name: 'Ana López', age: 5, classroom: classroom1.id },
            { name: 'Carlos Ruiz', age: 6, classroom: classroom1.id },
            { name: 'María Fernández', age: 7, classroom: classroom2.id },
            { name: 'Diego Torres', age: 6, classroom: classroom2.id },
            { name: 'Sofía Morales', age: 5, classroom: classroom1.id }
        ];
        for (const studentData of students) {
            const studentUser = await prisma.user.create({
                data: {
                    email: `${studentData.name.replace(/\s+/g, '').toLowerCase()}@demo.edu`,
                    password: studentPassword,
                    fullName: studentData.name,
                    role: types_1.UserRole.CHILD,
                    institutionId: demoInstitution.id,
                    isActive: true
                }
            });
            await prisma.student.create({
                data: {
                    userId: studentUser.id,
                    gradeLevel: studentData.age <= 5 ? 'Preescolar' : '1ro Básico',
                    birthDate: new Date(`${2018 + (7 - studentData.age)}-06-15`),
                }
            });
            if (Math.random() > 0.3) {
                await prisma.progress.create({
                    data: {
                        userId: studentUser.id,
                        gameId: pairGame.id,
                        score: Math.floor(Math.random() * 40) + 60,
                        timeSpent: Math.floor(Math.random() * 300) + 120,
                        completed: Math.random() > 0.4,
                        attempts: Math.floor(Math.random() * 3) + 1,
                        gameData: {
                            level: 'easy',
                            pairsFound: Math.floor(Math.random() * 8) + 4,
                            totalPairs: 8,
                            hintsUsed: Math.floor(Math.random() * 3)
                        }
                    }
                });
            }
        }
        console.log('💳 Creando suscripción...');
        await prisma.subscription.create({
            data: {
                institutionId: demoInstitution.id,
                planId: premiumPlan.id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                active: true
            }
        });
        console.log('✅ Seed completado exitosamente!');
        console.log('\n📊 Datos creados:');
        console.log(`- 🏢 Institución: ${demoInstitution.name}`);
        console.log(`- 👤 Usuarios: 4 (1 super admin, 1 admin, 2 tutores)`);
        console.log(`- 👶 Estudiantes: ${students.length}`);
        console.log(`- 🏫 Aulas: 2`);
        console.log(`- 🎮 Categorías: 4`);
        console.log(`- 🎯 Juegos: 3`);
        console.log(`- 📋 Planes: 3`);
        console.log('\n🔐 Credenciales de prueba:');
        console.log(`Super Admin: admin@koalaeducativo.com / admin123`);
        console.log(`Admin Institución: director@demodemo.edu / admin123`);
        console.log(`Tutor 1: maria.garcia@demo.edu / tutor123`);
        console.log(`Tutor 2: juan.perez@demo.edu / tutor123`);
    }
    catch (error) {
        console.error('❌ Error durante el seed:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map