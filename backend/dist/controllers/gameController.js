"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const validation_1 = require("../utils/validation");
const prisma = new client_1.PrismaClient();
const createGameSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    description: joi_1.default.string().max(500).optional(),
    difficulty: joi_1.default.string().valid('EASY', 'MEDIUM', 'HARD').required(),
    minAge: joi_1.default.number().integer().min(3).max(18).required(),
    maxAge: joi_1.default.number().integer().min(3).max(18).required(),
    estimatedDuration: joi_1.default.number().integer().min(1).max(120).required(),
    instructions: joi_1.default.string().required(),
    config: joi_1.default.object().required(),
    thumbnailUrl: joi_1.default.string().uri().optional(),
    categoryId: joi_1.default.string().uuid().required(),
});
const updateGameSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    description: joi_1.default.string().max(500).optional(),
    difficulty: joi_1.default.string().valid('EASY', 'MEDIUM', 'HARD').optional(),
    minAge: joi_1.default.number().integer().min(3).max(18).optional(),
    maxAge: joi_1.default.number().integer().min(3).max(18).optional(),
    estimatedDuration: joi_1.default.number().integer().min(1).max(120).optional(),
    instructions: joi_1.default.string().optional(),
    config: joi_1.default.object().optional(),
    thumbnailUrl: joi_1.default.string().uri().optional().allow(null),
    categoryId: joi_1.default.string().uuid().optional(),
    isActive: joi_1.default.boolean().optional(),
});
const gameConfigSchema = joi_1.default.object({
    gameId: joi_1.default.string().uuid().required(),
    institutionId: joi_1.default.string().uuid().required(),
    isEnabled: joi_1.default.boolean().required(),
    customConfig: joi_1.default.object().optional(),
    deviceSettings: joi_1.default.object({
        mobile: joi_1.default.object().optional(),
        tablet: joi_1.default.object().optional(),
        desktop: joi_1.default.object().optional(),
    }).optional(),
});
class GameController {
    static async getAll(req, res) {
        try {
            const { page = 1, limit = 20, search, categoryId, difficulty, isActive, institutionId } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const whereClause = {};
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
            let gamesWithConfig = games;
            if (institutionId && (req.user.role === types_1.UserRole.SUPER_ADMIN ||
                req.user.role === types_1.UserRole.ADMIN ||
                req.user.institutionId === institutionId)) {
                gamesWithConfig = games.map((game) => ({
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
        }
        catch (error) {
            console.error('Error en getAll games:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getById(req, res) {
        try {
            const id = (0, validation_1.validateUUID)(req.params['id'], 'id');
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
        }
        catch (error) {
            console.error('Error en getById game:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async create(req, res) {
        try {
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN) {
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
            const category = await prisma.gameCategory.findUnique({
                where: { id: value.categoryId }
            });
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoría no encontrada'
                });
            }
            if (value.minAge > value.maxAge) {
                return res.status(400).json({
                    success: false,
                    message: 'La edad mínima no puede ser mayor que la edad máxima'
                });
            }
            const newGame = await prisma.game.create({
                data: {
                    ...value,
                    difficulty: value.difficulty,
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
        }
        catch (error) {
            console.error('Error en create game:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN) {
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
            const existingGame = await prisma.game.findUnique({
                where: { id }
            });
            if (!existingGame) {
                return res.status(404).json({
                    success: false,
                    message: 'Juego no encontrado'
                });
            }
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
                    ...(value.difficulty && { difficulty: value.difficulty }),
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
        }
        catch (error) {
            console.error('Error en update game:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async toggleGame(req, res) {
        try {
            const { id } = req.params;
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN && req.user.role !== types_1.UserRole.ADMIN) {
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
        }
        catch (error) {
            console.error('Error en toggleGame:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getCategories(req, res) {
        try {
            const { isActive } = req.query;
            const whereClause = {};
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
        }
        catch (error) {
            console.error('Error en getCategories:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async configureForInstitution(req, res) {
        try {
            const gameId = (0, validation_1.validateUUID)(req.params['id'], 'gameId');
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN && req.user.role !== types_1.UserRole.ADMIN) {
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
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                req.user.institutionId !== institutionId) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo puedes configurar juegos para tu institución'
                });
            }
            const game = await prisma.game.findUnique({
                where: { id: gameId }
            });
            if (!game) {
                return res.status(404).json({
                    success: false,
                    message: 'Juego no encontrado'
                });
            }
            const institution = await prisma.institution.findUnique({
                where: { id: institutionId }
            });
            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institución no encontrada'
                });
            }
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
        }
        catch (error) {
            console.error('Error en configureForInstitution:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getInstitutionConfig(req, res) {
        try {
            const gameId = (0, validation_1.validateUUID)(req.params['id'], 'gameId');
            const institutionId = (0, validation_1.validateUUID)(req.params['institutionId'], 'institutionId');
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                req.user.role !== types_1.UserRole.ADMIN &&
                req.user.institutionId !== institutionId) {
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
            let config = await prisma.gameInstitutionConfig.findUnique({
                where: {
                    gameId_institutionId: {
                        gameId,
                        institutionId
                    }
                }
            });
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
                            timeLimit: 300,
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
                            timeLimit: 360,
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
                            timeLimit: 420,
                            pairsPerRow: 6
                        }
                    }
                };
                config = {
                    id: '',
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
        }
        catch (error) {
            console.error('Error en getInstitutionConfig:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getActiveGamesByInstitution(req, res) {
        try {
            const institutionId = (0, validation_1.validateUUID)(req.params['institutionId'], 'institutionId');
            const { page = 1, limit = 20, categoryId } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                req.user.role !== types_1.UserRole.ADMIN &&
                req.user.institutionId !== institutionId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver los juegos de esta institución'
                });
            }
            const institution = await prisma.institution.findUnique({
                where: { id: institutionId }
            });
            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institución no encontrada'
                });
            }
            const whereClause = {
                isActive: true
            };
            if (categoryId) {
                whereClause.categoryId = String(categoryId);
            }
            const institutionConfigs = await prisma.gameInstitutionConfig.findMany({
                where: {
                    institutionId: institutionId,
                    isEnabled: true
                }
            });
            const configMap = new Map();
            institutionConfigs.forEach(config => {
                configMap.set(config.gameId, config);
            });
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
            const activeGames = games.filter(game => {
                const config = configMap.get(game.id);
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
        }
        catch (error) {
            console.error('Error en getActiveGamesByInstitution:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}
exports.GameController = GameController;
//# sourceMappingURL=gameController.js.map