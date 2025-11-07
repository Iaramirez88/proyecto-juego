import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { AuthenticatedRequest, UserRole, GameDifficulty } from '../types';
import { validateUUID } from '../utils/validation';

const prisma = new PrismaClient();

// Esquemas de validación
const createGameSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').required(),
  minAge: Joi.number().integer().min(3).max(18).required(),
  maxAge: Joi.number().integer().min(3).max(18).required(),
  estimatedDuration: Joi.number().integer().min(1).max(120).required(),
  instructions: Joi.string().required(),
  config: Joi.object().required(),
  thumbnailUrl: Joi.string().uri().optional(),
  categoryId: Joi.string().uuid().required(),
});

const updateGameSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').optional(),
  minAge: Joi.number().integer().min(3).max(18).optional(),
  maxAge: Joi.number().integer().min(3).max(18).optional(),
  estimatedDuration: Joi.number().integer().min(1).max(120).optional(),
  instructions: Joi.string().optional(),
  config: Joi.object().optional(),
  thumbnailUrl: Joi.string().uri().optional().allow(null),
  categoryId: Joi.string().uuid().optional(),
  isActive: Joi.boolean().optional(),
});

const gameConfigSchema = Joi.object({
  gameId: Joi.string().uuid().required(),
  institutionId: Joi.string().uuid().required(),
  isEnabled: Joi.boolean().required(),
  customConfig: Joi.object().optional(),
  deviceSettings: Joi.object({
    mobile: Joi.object().optional(),
    tablet: Joi.object().optional(),
    desktop: Joi.object().optional(),
  }).optional(),
});

export class GameController {
  /**
   * GET /api/games
   * Obtener juegos con filtros y configuraciones por institución
   */
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 20, search, categoryId, difficulty, isActive, institutionId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};

      // Filtros básicos
      if (search) {
        whereClause.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { description: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      if (categoryId) {
        whereClause.categoryId = String(categoryId);
      }

      if (difficulty) {
        whereClause.difficulty = String(difficulty);
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const [games, total] = await Promise.all([
        prisma.game.findMany({
          where: whereClause,
          skip,
          take: Number(limit),
          include: {
            category: {
              select: {
                id: true,
                name: true,
                color: true,
                iconUrl: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.game.count({ where: whereClause })
      ]);

      // Si se especifica institución, obtener configuraciones específicas
      let gamesWithConfig = games;
      if (institutionId && (req.user!.role === UserRole.SUPER_ADMIN || 
                           req.user!.role === UserRole.ADMIN ||
                           req.user!.institutionId === institutionId)) {
        
        // TODO: Aquí se obtendría la configuración específica por institución
        // Por ahora devolvemos los juegos con su configuración base
        gamesWithConfig = games.map((game: any) => ({
          ...game,
          institutionConfig: {
            isEnabled: game.isActive,
            customConfig: null,
            deviceSettings: null
          }
        }));
      }

      res.json({
        success: true,
        data: {
          games: gamesWithConfig,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });

    } catch (error) {
      console.error('Error en getAll games:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/games/:id
   * Obtener un juego específico con su configuración
   */
  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = validateUUID(req.params['id'], 'id');
      const { institutionId } = req.query;

      const game = await prisma.game.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              color: true,
              iconUrl: true,
            }
          },
          achievements: {
            select: {
              id: true,
              name: true,
              description: true,
              type: true,
              points: true,
              iconUrl: true,
            },
            where: { isActive: true }
          }
        }
      });

      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Juego no encontrado'
        });
      }

      res.json({
        success: true,
        data: game
      });

    } catch (error) {
      console.error('Error en getById game:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/games
   * Crear nuevo juego (solo SUPER_ADMIN)
   */
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      // Solo SUPER_ADMIN puede crear juegos
      if (req.user!.role !== UserRole.SUPER_ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'Solo SUPER_ADMIN puede crear juegos'
        });
      }

      const { error, value } = createGameSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.details.map(d => d.message)
        });
      }

      // Verificar que la categoría existe
      const category = await prisma.gameCategory.findUnique({
        where: { id: value.categoryId }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      // Verificar que minAge <= maxAge
      if (value.minAge > value.maxAge) {
        return res.status(400).json({
          success: false,
          message: 'La edad mínima no puede ser mayor que la edad máxima'
        });
      }

      const newGame = await prisma.game.create({
        data: {
          ...value,
          difficulty: value.difficulty as GameDifficulty,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Juego creado exitosamente',
        data: { game: newGame }
      });

    } catch (error) {
      console.error('Error en create game:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/games/:id
   * Actualizar juego (solo SUPER_ADMIN)
   */
  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Solo SUPER_ADMIN puede actualizar juegos
      if (req.user!.role !== UserRole.SUPER_ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'Solo SUPER_ADMIN puede actualizar juegos'
        });
      }

      const { error, value } = updateGameSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.details.map(d => d.message)
        });
      }

      // Verificar que el juego existe
      const existingGame = await prisma.game.findUnique({
        where: { id }
      });

      if (!existingGame) {
        return res.status(404).json({
          success: false,
          message: 'Juego no encontrado'
        });
      }

      // Si se está cambiando la categoría, verificar que existe
      if (value.categoryId) {
        const category = await prisma.gameCategory.findUnique({
          where: { id: value.categoryId }
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            message: 'Categoría no encontrada'
          });
        }
      }

      // Verificar edades si se proporcionan
      const minAge = value.minAge ?? existingGame.minAge;
      const maxAge = value.maxAge ?? existingGame.maxAge;
      
      if (minAge > maxAge) {
        return res.status(400).json({
          success: false,
          message: 'La edad mínima no puede ser mayor que la edad máxima'
        });
      }

      const updatedGame = await prisma.game.update({
        where: { id },
        data: {
          ...value,
          ...(value.difficulty && { difficulty: value.difficulty as GameDifficulty }),
          updatedAt: new Date(),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Juego actualizado exitosamente',
        data: { game: updatedGame }
      });

    } catch (error) {
      console.error('Error en update game:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/games/:id/toggle
   * Activar/desactivar juego (ADMIN y SUPER_ADMIN)
   */
  static async toggleGame(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Solo ADMIN y SUPER_ADMIN pueden togglear juegos
      if (req.user!.role !== UserRole.SUPER_ADMIN && req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para activar/desactivar juegos'
        });
      }

      const game = await prisma.game.findUnique({
        where: { id }
      });

      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Juego no encontrado'
        });
      }

      const updatedGame = await prisma.game.update({
        where: { id },
        data: { 
          isActive: !game.isActive,
          updatedAt: new Date(),
        },
        include: {
          category: {
            select: {
              name: true
            }
          }
        }
      });

      res.json({
        success: true,
        message: `Juego ${updatedGame.isActive ? 'activado' : 'desactivado'} exitosamente`,
        data: { game: updatedGame }
      });

    } catch (error) {
      console.error('Error en toggleGame:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/games/categories
   * Obtener todas las categorías de juegos
   */
  static async getCategories(req: AuthenticatedRequest, res: Response) {
    try {
      const { isActive } = req.query;

      const whereClause: any = {};
      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const categories = await prisma.gameCategory.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              games: {
                where: { isActive: true }
              }
            }
          }
        },
        orderBy: { name: 'asc' }
      });

      res.json({
        success: true,
        data: { categories }
      });

    } catch (error) {
      console.error('Error en getCategories:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/games/:id/config
   * Configurar juego para una institución específica
   */
  static async configureForInstitution(req: AuthenticatedRequest, res: Response) {
    try {
      const gameId = validateUUID(req.params['id'], 'gameId');

      // Solo ADMIN y SUPER_ADMIN pueden configurar
      if (req.user!.role !== UserRole.SUPER_ADMIN && req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para configurar juegos'
        });
      }

      const { error, value } = gameConfigSchema.validate({
        ...req.body,
        gameId
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.details.map(d => d.message)
        });
      }

      const { institutionId, isEnabled, customConfig, deviceSettings } = value;

      // Verificar que el usuario puede configurar para esta institución
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          req.user!.institutionId !== institutionId) {
        return res.status(403).json({
          success: false,
          message: 'Solo puedes configurar juegos para tu institución'
        });
      }

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

      // Verificar que la institución existe
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId }
      });

      if (!institution) {
        return res.status(404).json({
          success: false,
          message: 'Institución no encontrada'
        });
      }

      // Configuración por defecto para dispositivos
      const defaultDeviceSettings = {
        mobile: {
          adaptiveUI: true,
          touchControls: true,
          reduceAnimations: false,
          pairModule: {
            cardSize: 'small',
            animationSpeed: 'normal',
            maxCards: 12,
            showHints: true,
            pairsPerRow: 2
          }
        },
        tablet: {
          adaptiveUI: true,
          touchControls: true,
          reduceAnimations: false,
          pairModule: {
            cardSize: 'medium',
            animationSpeed: 'normal',
            maxCards: 16,
            showHints: true,
            pairsPerRow: 4
          }
        },
        desktop: {
          adaptiveUI: false,
          touchControls: false,
          reduceAnimations: false,
          pairModule: {
            cardSize: 'large',
            animationSpeed: 'fast',
            maxCards: 20,
            showHints: false,
            pairsPerRow: 6
          }
        }
      };

      // Crear o actualizar configuración en la base de datos
      const gameConfig = await prisma.gameInstitutionConfig.upsert({
        where: {
          gameId_institutionId: {
            gameId,
            institutionId
          }
        },
        update: {
          isEnabled,
          customConfig: customConfig || game.config,
          deviceSettings: deviceSettings || defaultDeviceSettings
        },
        create: {
          gameId,
          institutionId,
          isEnabled,
          customConfig: customConfig || game.config,
          deviceSettings: deviceSettings || defaultDeviceSettings
        }
      });

      res.json({
        success: true,
        message: 'Configuración de juego actualizada exitosamente',
        data: { gameConfig }
      });

    } catch (error) {
      console.error('Error en configureForInstitution:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/games/:id/config/:institutionId
   * Obtener configuración específica de un juego para una institución
   */
  static async getInstitutionConfig(req: AuthenticatedRequest, res: Response) {
    try {
      const gameId = validateUUID(req.params['id'], 'gameId');
      const institutionId = validateUUID(req.params['institutionId'], 'institutionId');

      // Verificar permisos
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          req.user!.role !== UserRole.ADMIN &&
          req.user!.institutionId !== institutionId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver esta configuración'
        });
      }

      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          category: {
            select: {
              name: true,
              color: true
            }
          }
        }
      });

      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Juego no encontrado'
        });
      }

      // Obtener configuración específica de la base de datos
      let config = await prisma.gameInstitutionConfig.findUnique({
        where: {
          gameId_institutionId: {
            gameId,
            institutionId
          }
        }
      });

      // Si no existe configuración específica, crear una por defecto
      if (!config) {
        const defaultDeviceSettings = {
          mobile: {
            adaptiveUI: true,
            touchControls: true,
            reduceAnimations: false,
            pairModule: {
              cardSize: 'small',
              animationSpeed: 'normal',
              maxCards: 12,
              showHints: true,
              autoFlip: false,
              timeLimit: 300, // 5 minutos
              pairsPerRow: 2
            }
          },
          tablet: {
            adaptiveUI: true,
            touchControls: true,
            reduceAnimations: false,
            pairModule: {
              cardSize: 'medium',
              animationSpeed: 'normal',
              maxCards: 16,
              showHints: true,
              autoFlip: false,
              timeLimit: 360, // 6 minutos
              pairsPerRow: 4
            }
          },
          desktop: {
            adaptiveUI: false,
            touchControls: false,
            reduceAnimations: false,
            pairModule: {
              cardSize: 'large',
              animationSpeed: 'fast',
              maxCards: 20,
              showHints: false,
              autoFlip: false,
              timeLimit: 420, // 7 minutos
              pairsPerRow: 6
            }
          }
        };

        config = {
          id: '', // Temporal ya que no existe aún
          gameId,
          institutionId,
          isEnabled: game.isActive,
          customConfig: game.config,
          deviceSettings: defaultDeviceSettings,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

      res.json({
        success: true,
        data: { 
          game: {
            id: game.id,
            name: game.name,
            category: game.category
          },
          config 
        }
      });

    } catch (error) {
      console.error('Error en getInstitutionConfig:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/institutions/:institutionId/games/active
   * Obtener juegos activos para una institución específica
   */
  static async getActiveGamesByInstitution(req: AuthenticatedRequest, res: Response) {
    try {
      const institutionId = validateUUID(req.params['institutionId'], 'institutionId');
      const { page = 1, limit = 20, categoryId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Verificar permisos
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          req.user!.role !== UserRole.ADMIN &&
          req.user!.institutionId !== institutionId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver los juegos de esta institución'
        });
      }

      // Verificar que la institución existe
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId }
      });

      if (!institution) {
        return res.status(404).json({
          success: false,
          message: 'Institución no encontrada'
        });
      }

      // Construir filtros
      const whereClause: any = {
        isActive: true
      };

      if (categoryId) {
        whereClause.categoryId = String(categoryId);
      }

      // Obtener configuraciones específicas para la institución
      const institutionConfigs = await prisma.gameInstitutionConfig.findMany({
        where: {
          institutionId: institutionId,
          isEnabled: true
        }
      });

      // Crear un mapa de configuraciones por gameId
      const configMap = new Map();
      institutionConfigs.forEach(config => {
        configMap.set(config.gameId, config);
      });

      // Obtener juegos base
      const [games, total] = await Promise.all([
        prisma.game.findMany({
          where: whereClause,
          skip,
          take: Number(limit),
          include: {
            category: {
              select: {
                id: true,
                name: true,
                color: true,
                iconUrl: true,
              }
            }
          },
          orderBy: { name: 'asc' }
        }),
        prisma.game.count({ where: whereClause })
      ]);

      // Filtrar y mapear juegos activos
      const activeGames = games.filter(game => {
        const config = configMap.get(game.id);
        // Si hay configuración específica, debe estar habilitada
        // Si no hay configuración, el juego está habilitado por defecto
        return config ? config.isEnabled : game.isActive;
      }).map(game => {
        const config = configMap.get(game.id);
        
        return {
          id: game.id,
          name: game.name,
          description: game.description,
          difficulty: game.difficulty,
          minAge: game.minAge,
          maxAge: game.maxAge,
          estimatedDuration: game.estimatedDuration,
          instructions: game.instructions,
          thumbnailUrl: game.thumbnailUrl,
          category: game.category,
          // Incluir configuración específica si existe
          institutionConfig: config ? {
            customConfig: config.customConfig || game.config,
            deviceSettings: config.deviceSettings,
            updatedAt: config.updatedAt
          } : {
            customConfig: game.config,
            deviceSettings: null,
            updatedAt: null
          }
        };
      });

      res.json({
        success: true,
        data: {
          institution: {
            id: institution.id,
            name: institution.name
          },
          games: activeGames,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: activeGames.length,
            totalPages: Math.ceil(activeGames.length / Number(limit))
          }
        }
      });

    } catch (error) {
      console.error('Error en getActiveGamesByInstitution:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}