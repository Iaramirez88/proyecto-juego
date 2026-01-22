"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const prisma = new client_1.PrismaClient();
const createProgressSchema = joi_1.default.object({
    gameId: joi_1.default.string().uuid().required(),
    activityId: joi_1.default.string().uuid().optional(),
    score: joi_1.default.number().min(0).max(100).optional(),
    timeSpent: joi_1.default.number().integer().min(0).optional(),
    completed: joi_1.default.boolean().optional(),
    gameData: joi_1.default.object().optional(),
});
const updateProgressSchema = joi_1.default.object({
    score: joi_1.default.number().min(0).max(100).optional(),
    timeSpent: joi_1.default.number().integer().min(0).optional(),
    completed: joi_1.default.boolean().optional(),
    gameData: joi_1.default.object().optional(),
});
class ProgressController {
    static async createProgress(req, res) {
        try {
            const { error, value } = createProgressSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const { gameId, activityId, score, timeSpent, completed, gameData } = value;
            const userId = req.user.userId;
            const game = await prisma.game.findUnique({
                where: { id: gameId }
            });
            if (!game) {
                return res.status(404).json({
                    success: false,
                    message: 'Juego no encontrado'
                });
            }
            if (activityId) {
                const activity = await prisma.activity.findUnique({
                    where: { id: activityId },
                    include: {
                        classroom: {
                            select: {
                                institutionId: true
                            }
                        }
                    }
                });
                if (!activity) {
                    return res.status(404).json({
                        success: false,
                        message: 'Actividad no encontrada'
                    });
                }
                if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                    activity.classroom.institutionId !== req.user.institutionId) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes acceso a esta actividad'
                    });
                }
            }
            const existingProgress = await prisma.progress.findFirst({
                where: {
                    userId,
                    gameId,
                    activityId
                }
            });
            let progress;
            if (existingProgress) {
                progress = await prisma.progress.update({
                    where: { id: existingProgress.id },
                    data: {
                        score: score ?? existingProgress.score,
                        timeSpent: timeSpent ? (existingProgress.timeSpent || 0) + timeSpent : existingProgress.timeSpent,
                        completed: completed ?? existingProgress.completed,
                        attempts: existingProgress.attempts + 1,
                        gameData: gameData ?? existingProgress.gameData,
                        updatedAt: new Date(),
                    },
                    include: {
                        game: {
                            select: {
                                id: true,
                                name: true,
                                category: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        activity: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                });
            }
            else {
                progress = await prisma.progress.create({
                    data: {
                        userId,
                        gameId,
                        activityId,
                        score,
                        timeSpent,
                        completed: completed ?? false,
                        attempts: 1,
                        gameData,
                    },
                    include: {
                        game: {
                            select: {
                                id: true,
                                name: true,
                                category: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        activity: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                });
            }
            res.status(201).json({
                success: true,
                message: 'Progreso registrado exitosamente',
                data: { progress }
            });
        }
        catch (error) {
            console.error('Error en createProgress:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getUserProgress(req, res) {
        try {
            const { userId } = req.params;
            const { gameId, categoryId, completed, limit = 50, page = 1 } = req.query;
            const canView = req.user.userId === userId ||
                req.user.role === types_1.UserRole.SUPER_ADMIN ||
                req.user.role === types_1.UserRole.ADMIN ||
                req.user.role === types_1.UserRole.TUTOR;
            if (!canView) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver este progreso'
                });
            }
            const whereClause = { userId };
            if (gameId) {
                whereClause.gameId = String(gameId);
            }
            if (categoryId) {
                whereClause.game = {
                    categoryId: String(categoryId)
                };
            }
            if (completed !== undefined) {
                whereClause.completed = completed === 'true';
            }
            const skip = (Number(page) - 1) * Number(limit);
            const [progressList, total] = await Promise.all([
                prisma.progress.findMany({
                    where: whereClause,
                    skip,
                    take: Number(limit),
                    include: {
                        game: {
                            select: {
                                id: true,
                                name: true,
                                difficulty: true,
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                        color: true,
                                    }
                                }
                            }
                        },
                        activity: {
                            select: {
                                id: true,
                                name: true,
                                classroom: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { updatedAt: 'desc' }
                }),
                prisma.progress.count({ where: whereClause })
            ]);
            res.json({
                success: true,
                data: {
                    progress: progressList,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages: Math.ceil(total / Number(limit))
                    }
                }
            });
        }
        catch (error) {
            console.error('Error en getUserProgress:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getClassroomProgress(req, res) {
        try {
            const { classroomId } = req.params;
            const { gameId, completed } = req.query;
            const classroom = await prisma.classroom.findUnique({
                where: { id: classroomId },
                include: {
                    students: {
                        select: {
                            userId: true,
                            user: {
                                select: {
                                    id: true,
                                    fullName: true
                                }
                            }
                        },
                        where: {}
                    }
                }
            });
            if (!classroom) {
                return res.status(404).json({
                    success: false,
                    message: 'Aula no encontrada'
                });
            }
            const canView = req.user.role === types_1.UserRole.SUPER_ADMIN ||
                req.user.role === types_1.UserRole.ADMIN ||
                (req.user.role === types_1.UserRole.TUTOR && classroom.institutionId === req.user.institutionId);
            if (!canView) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver el progreso de esta aula'
                });
            }
            const studentUserIds = classroom.students.map((s) => s.userId);
            const whereClause = {
                userId: { in: studentUserIds }
            };
            if (gameId) {
                whereClause.gameId = String(gameId);
            }
            if (completed !== undefined) {
                whereClause.completed = completed === 'true';
            }
            const progressData = await prisma.progress.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true
                        }
                    },
                    game: {
                        select: {
                            id: true,
                            name: true,
                            difficulty: true,
                            category: {
                                select: {
                                    name: true,
                                    color: true
                                }
                            }
                        }
                    }
                },
                orderBy: [
                    { user: { fullName: 'asc' } },
                    { updatedAt: 'desc' }
                ]
            });
            const progressByStudent = studentUserIds.map((userId) => {
                const student = classroom.students.find((s) => s.userId === userId);
                const studentProgress = progressData.filter((p) => p.userId === userId);
                return {
                    student: student?.user,
                    progress: studentProgress,
                    stats: {
                        totalGames: studentProgress.length,
                        completedGames: studentProgress.filter((p) => p.completed).length,
                        averageScore: studentProgress.length > 0
                            ? studentProgress.reduce((sum, p) => sum + (p.score || 0), 0) / studentProgress.length
                            : 0,
                        totalTimeSpent: studentProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0)
                    }
                };
            });
            res.json({
                success: true,
                data: {
                    classroom: {
                        id: classroom.id,
                        name: classroom.name
                    },
                    studentsProgress: progressByStudent
                }
            });
        }
        catch (error) {
            console.error('Error en getClassroomProgress:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getUserStats(req, res) {
        try {
            const { userId } = req.params;
            const canView = req.user.userId === userId ||
                req.user.role === types_1.UserRole.SUPER_ADMIN ||
                req.user.role === types_1.UserRole.ADMIN ||
                req.user.role === types_1.UserRole.TUTOR;
            if (!canView) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver estas estadísticas'
                });
            }
            const [totalProgress, completedGames, averageScore, totalTimeSpent, progressByCategory, recentProgress] = await Promise.all([
                prisma.progress.count({
                    where: { userId }
                }),
                prisma.progress.count({
                    where: { userId, completed: true }
                }),
                prisma.progress.aggregate({
                    where: { userId, score: { not: null } },
                    _avg: { score: true }
                }),
                prisma.progress.aggregate({
                    where: { userId, timeSpent: { not: null } },
                    _sum: { timeSpent: true }
                }),
                prisma.progress.groupBy({
                    by: ['gameId'],
                    where: { userId },
                    _count: { gameId: true },
                    _avg: { score: true },
                    _max: { completed: true }
                }),
                prisma.progress.findMany({
                    where: { userId },
                    take: 10,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        game: {
                            select: {
                                name: true,
                                category: {
                                    select: {
                                        name: true,
                                        color: true
                                    }
                                }
                            }
                        }
                    }
                })
            ]);
            const stats = {
                totalGames: totalProgress,
                completedGames,
                completionRate: totalProgress > 0 ? (completedGames / totalProgress) * 100 : 0,
                averageScore: averageScore._avg.score || 0,
                totalTimeSpent: totalTimeSpent._sum.timeSpent || 0,
                recentActivity: recentProgress
            };
            res.json({
                success: true,
                data: { stats }
            });
        }
        catch (error) {
            console.error('Error en getUserStats:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async updateProgress(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateProgressSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const existingProgress = await prisma.progress.findUnique({
                where: { id }
            });
            if (!existingProgress) {
                return res.status(404).json({
                    success: false,
                    message: 'Progreso no encontrado'
                });
            }
            const canEdit = req.user.userId === existingProgress.userId ||
                req.user.role === types_1.UserRole.SUPER_ADMIN ||
                req.user.role === types_1.UserRole.ADMIN ||
                req.user.role === types_1.UserRole.TUTOR;
            if (!canEdit) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para editar este progreso'
                });
            }
            const updatedProgress = await prisma.progress.update({
                where: { id },
                data: {
                    ...value,
                    updatedAt: new Date(),
                },
                include: {
                    game: {
                        select: {
                            id: true,
                            name: true,
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
            res.json({
                success: true,
                message: 'Progreso actualizado exitosamente',
                data: { progress: updatedProgress }
            });
        }
        catch (error) {
            console.error('Error en updateProgress:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async deleteProgress(req, res) {
        try {
            const { id } = req.params;
            const progress = await prisma.progress.findUnique({
                where: { id }
            });
            if (!progress) {
                return res.status(404).json({
                    success: false,
                    message: 'Progreso no encontrado'
                });
            }
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN && req.user.role !== types_1.UserRole.ADMIN) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para eliminar progreso'
                });
            }
            await prisma.progress.delete({
                where: { id }
            });
            res.json({
                success: true,
                message: 'Progreso eliminado exitosamente'
            });
        }
        catch (error) {
            console.error('Error en deleteProgress:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}
exports.ProgressController = ProgressController;
//# sourceMappingURL=progressController.js.map