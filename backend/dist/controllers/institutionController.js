"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionController = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
const createInstitutionSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(200).required(),
    description: joi_1.default.string().max(500).optional(),
    address: joi_1.default.string().max(300).optional(),
    phone: joi_1.default.string().max(20).optional(),
    email: joi_1.default.string().email().optional(),
    website: joi_1.default.string().uri().optional(),
});
const updateInstitutionSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(200).optional(),
    description: joi_1.default.string().max(500).optional(),
    address: joi_1.default.string().max(300).optional(),
    phone: joi_1.default.string().max(20).optional(),
    email: joi_1.default.string().email().optional(),
    website: joi_1.default.string().uri().optional(),
    isActive: joi_1.default.boolean().optional(),
});
class InstitutionController {
    static async getAll(req, res) {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const whereClause = {};
            if (search) {
                whereClause.OR = [
                    { name: { contains: String(search), mode: 'insensitive' } },
                    { description: { contains: String(search), mode: 'insensitive' } },
                ];
            }
            const [institutions, total] = await Promise.all([
                prisma.institution.findMany({
                    where: whereClause,
                    skip,
                    take: Number(limit),
                    include: {
                        _count: {
                            select: {
                                users: true,
                                classrooms: true,
                                subscriptions: true,
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.institution.count({ where: whereClause })
            ]);
            res.json({
                success: true,
                data: {
                    institutions,
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
            console.error('Error en getAll institutions:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const institution = await prisma.institution.findUnique({
                where: { id },
                include: {
                    users: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                            isActive: true,
                        },
                        where: { isActive: true }
                    },
                    classrooms: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            isActive: true,
                            _count: {
                                select: { students: true }
                            }
                        },
                        where: { isActive: true }
                    },
                    subscriptions: {
                        select: {
                            id: true,
                            plan: {
                                select: {
                                    id: true,
                                    name: true,
                                    priceMonth: true,
                                }
                            },
                            startDate: true,
                            endDate: true,
                            active: true,
                        },
                        where: { active: true }
                    },
                    _count: {
                        select: {
                            users: true,
                            classrooms: true,
                            subscriptions: true,
                        }
                    }
                }
            });
            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institución no encontrada'
                });
            }
            res.json({
                success: true,
                data: { institution }
            });
        }
        catch (error) {
            console.error('Error en getById institution:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async create(req, res) {
        try {
            const { error, value } = createInstitutionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const existingInstitution = await prisma.institution.findFirst({
                where: {
                    name: { equals: value.name, mode: 'insensitive' }
                }
            });
            if (existingInstitution) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una institución con ese nombre'
                });
            }
            const newInstitution = await prisma.institution.create({
                data: {
                    ...value,
                    createdBy: req.user.userId,
                }
            });
            res.status(201).json({
                success: true,
                message: 'Institución creada exitosamente',
                data: { institution: newInstitution }
            });
        }
        catch (error) {
            console.error('Error en create institution:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateInstitutionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const existingInstitution = await prisma.institution.findUnique({
                where: { id }
            });
            if (!existingInstitution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institución no encontrada'
                });
            }
            if (value.name) {
                const nameConflict = await prisma.institution.findFirst({
                    where: {
                        name: { equals: value.name, mode: 'insensitive' },
                        id: { not: id }
                    }
                });
                if (nameConflict) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe otra institución con ese nombre'
                    });
                }
            }
            const updatedInstitution = await prisma.institution.update({
                where: { id },
                data: {
                    ...value,
                    updatedAt: new Date(),
                }
            });
            res.json({
                success: true,
                message: 'Institución actualizada exitosamente',
                data: { institution: updatedInstitution }
            });
        }
        catch (error) {
            console.error('Error en update institution:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const institution = await prisma.institution.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            users: true,
                            classrooms: true,
                            subscriptions: true,
                        }
                    }
                }
            });
            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institución no encontrada'
                });
            }
            if (institution._count.users > 0 || institution._count.classrooms > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede eliminar una institución que tiene usuarios o aulas asociadas'
                });
            }
            await prisma.institution.update({
                where: { id },
                data: {
                    updatedAt: new Date(),
                }
            });
            res.json({
                success: true,
                message: 'Institución desactivada exitosamente'
            });
        }
        catch (error) {
            console.error('Error en delete institution:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getStats(req, res) {
        try {
            const { id } = req.params;
            const institution = await prisma.institution.findUnique({
                where: { id }
            });
            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institución no encontrada'
                });
            }
            const [totalUsers, activeUsers, totalClassrooms, activeClassrooms, totalStudents, activeStudents, activeSubscriptions] = await Promise.all([
                prisma.user.count({ where: { institutionId: id } }),
                prisma.user.count({ where: { institutionId: id, isActive: true } }),
                prisma.classroom.count({ where: { institutionId: id } }),
                prisma.classroom.count({ where: { institutionId: id, isActive: true } }),
                prisma.student.count({
                    where: {
                        classroom: { institutionId: id }
                    }
                }),
                prisma.student.count({
                    where: {
                        classroom: { institutionId: id },
                    }
                }),
                prisma.subscription.count({
                    where: {
                        institutionId: id,
                        active: true
                    }
                })
            ]);
            const stats = {
                users: { total: totalUsers, active: activeUsers },
                classrooms: { total: totalClassrooms, active: activeClassrooms },
                students: { total: totalStudents, active: activeStudents },
                subscriptions: { active: activeSubscriptions }
            };
            res.json({
                success: true,
                data: { stats }
            });
        }
        catch (error) {
            console.error('Error en getStats institution:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}
exports.InstitutionController = InstitutionController;
//# sourceMappingURL=institutionController.js.map