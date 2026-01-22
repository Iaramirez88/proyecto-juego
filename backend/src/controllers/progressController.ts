import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { AuthenticatedRequest, UserRole } from '../types';

const prisma = new PrismaClient();

// Esquemas de validación
const createProgressSchema = Joi.object({
  gameId: Joi.string().uuid().required(),
  activityId: Joi.string().uuid().optional(),
  score: Joi.number().min(0).max(100).optional(),
  timeSpent: Joi.number().integer().min(0).optional(),
  completed: Joi.boolean().optional(),
  gameData: Joi.object().optional(),
});

const updateProgressSchema = Joi.object({
  score: Joi.number().min(0).max(100).optional(),
  timeSpent: Joi.number().integer().min(0).optional(),
  completed: Joi.boolean().optional(),
  gameData: Joi.object().optional(),
});

export class ProgressController {
  /**
   * POST /api/progress
   * Registrar progreso de un juego
   */
  static async createProgress(req: AuthenticatedRequest, res: Response) {
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
      const userId = req.user!.userId;

      // Verificar que el juego existe
      const game = await prisma.game.findUnique({
        where: { id: gameId }
      });

      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Juego no encontrado'
        });
      }

      // Si hay activityId, verificar que la actividad existe y el usuario puede acceder
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

        // Verificar que el usuario puede acceder a esta actividad
        if (req.user!.role !== UserRole.SUPER_ADMIN && 
            activity.classroom.institutionId !== req.user!.institutionId) {
          return res.status(403).json({
            success: false,
            message: 'No tienes acceso a esta actividad'
          });
        }
      }

      // Buscar si ya existe progreso para este usuario/juego/actividad
      const existingProgress = await prisma.progress.findFirst({
        where: {
          userId,
          gameId,
          activityId
        }
      });

      let progress;
      if (existingProgress) {
        // Actualizar progreso existente
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
      } else {
        // Crear nuevo progreso
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

    } catch (error) {
      console.error('Error en createProgress:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/progress/user/:userId
   * Obtener progreso de un usuario específico
   */
  static async getUserProgress(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { gameId, categoryId, completed, limit = 50, page = 1 } = req.query;

      // Verificar permisos para ver progreso
      const canView = req.user!.userId === userId ||
                     req.user!.role === UserRole.SUPER_ADMIN ||
                     req.user!.role === UserRole.ADMIN ||
                     req.user!.role === UserRole.TUTOR;

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver este progreso'
        });
      }

      const whereClause: any = { userId };
      
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

    } catch (error) {
      console.error('Error en getUserProgress:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/progress/classroom/:classroomId
   * Obtener progreso de todos los estudiantes de un aula
   */
  static async getClassroomProgress(req: AuthenticatedRequest, res: Response) {
    try {
      const { classroomId } = req.params;
      const { gameId, completed } = req.query;

      // Verificar que el aula existe y el usuario tiene acceso
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

      // Verificar permisos
      const canView = req.user!.role === UserRole.SUPER_ADMIN ||
                     req.user!.role === UserRole.ADMIN ||
                     (req.user!.role === UserRole.TUTOR && classroom.institutionId === req.user!.institutionId);

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver el progreso de esta aula'
        });
      }

      const studentUserIds = classroom.students.map((s: any) => s.userId);

      const whereClause: any = {
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

      // Agrupar por estudiante
      const progressByStudent = studentUserIds.map((userId: any) => {
        const student = classroom.students.find((s: any) => s.userId === userId);
        const studentProgress = progressData.filter((p: any) => p.userId === userId);
        
        return {
          student: student?.user,
          progress: studentProgress,
          stats: {
            totalGames: studentProgress.length,
            completedGames: studentProgress.filter((p: any) => p.completed).length,
            averageScore: studentProgress.length > 0 
              ? studentProgress.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / studentProgress.length 
              : 0,
            totalTimeSpent: studentProgress.reduce((sum: number, p: any) => sum + (p.timeSpent || 0), 0)
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

    } catch (error) {
      console.error('Error en getClassroomProgress:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/progress/stats/user/:userId
   * Obtener estadísticas de progreso de un usuario
   */
  static async getUserStats(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;

      // Verificar permisos
      const canView = req.user!.userId === userId ||
                     req.user!.role === UserRole.SUPER_ADMIN ||
                     req.user!.role === UserRole.ADMIN ||
                     req.user!.role === UserRole.TUTOR;

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver estas estadísticas'
        });
      }

      const [
        totalProgress,
        completedGames,
        averageScore,
        totalTimeSpent,
        progressByCategory,
        recentProgress
      ] = await Promise.all([
        // Total de registros de progreso
        prisma.progress.count({
          where: { userId }
        }),
        
        // Juegos completados
        prisma.progress.count({
          where: { userId, completed: true }
        }),
        
        // Puntuación promedio
        prisma.progress.aggregate({
          where: { userId, score: { not: null } },
          _avg: { score: true }
        }),
        
        // Tiempo total gastado
        prisma.progress.aggregate({
          where: { userId, timeSpent: { not: null } },
          _sum: { timeSpent: true }
        }),
        
        // Progreso por categoría
        prisma.progress.groupBy({
          by: ['gameId'],
          where: { userId },
          _count: { gameId: true },
          _avg: { score: true },
          _max: { completed: true }
        }),
        
        // Progreso reciente (últimos 10 registros)
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

    } catch (error) {
      console.error('Error en getUserStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/progress/:id
   * Actualizar progreso específico
   */
  static async updateProgress(req: AuthenticatedRequest, res: Response) {
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

      // Verificar que el progreso existe
      const existingProgress = await prisma.progress.findUnique({
        where: { id }
      });

      if (!existingProgress) {
        return res.status(404).json({
          success: false,
          message: 'Progreso no encontrado'
        });
      }

      // Verificar permisos (solo el propio usuario o admins/tutores)
      const canEdit = req.user!.userId === existingProgress.userId ||
                     req.user!.role === UserRole.SUPER_ADMIN ||
                     req.user!.role === UserRole.ADMIN ||
                     req.user!.role === UserRole.TUTOR;

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

    } catch (error) {
      console.error('Error en updateProgress:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * DELETE /api/progress/:id
   * Eliminar registro de progreso
   */
  static async deleteProgress(req: AuthenticatedRequest, res: Response) {
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

      // Solo admins pueden eliminar progreso
      if (req.user!.role !== UserRole.SUPER_ADMIN && req.user!.role !== UserRole.ADMIN) {
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

    } catch (error) {
      console.error('Error en deleteProgress:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}