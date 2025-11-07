"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomController = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const authService_1 = require("../services/authService");
const prisma = new client_1.PrismaClient();
const createClassroomSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    description: joi_1.default.string().max(500).optional(),
    institutionId: joi_1.default.string().uuid().required(),
    teacherId: joi_1.default.string().uuid().optional(),
});
const updateClassroomSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    description: joi_1.default.string().max(500).optional(),
    teacherId: joi_1.default.string().uuid().optional().allow(null),
    isActive: joi_1.default.boolean().optional(),
});
const addStudentSchema = joi_1.default.object({
    studentName: joi_1.default.string().min(2).max(100).required(),
    birthDate: joi_1.default.date().optional(),
    parentId: joi_1.default.string().uuid().optional(),
});
class ClassroomController {
    static async getAll(req, res) {
        try {
            const { page = 1, limit = 10, search, institutionId, teacherId, isActive } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const whereClause = {};
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN) {
                whereClause.institutionId = req.user.institutionId;
            }
            else if (institutionId) {
                whereClause.institutionId = String(institutionId);
            }
            if (search) {
                whereClause.OR = [
                    { name: { contains: String(search), mode: 'insensitive' } },
                    { description: { contains: String(search), mode: 'insensitive' } },
                ];
            }
            if (teacherId) {
                whereClause.teacherId = String(teacherId);
            }
            if (isActive !== undefined) {
                whereClause.isActive = isActive === 'true';
            }
            const [classrooms, total] = await Promise.all([
                prisma.classroom.findMany({
                    where: whereClause,
                    skip,
                    take: Number(limit),
                    include: {
                        institution: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                        teacher: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            }
                        },
                        _count: {
                            select: {
                                students: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.classroom.count({ where: whereClause })
            ]);
            res.json({
                success: true,
                data: {
                    classrooms,
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
            console.error('Error en getAll classrooms:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const classroom = await prisma.classroom.findUnique({
                where: { id },
                include: {
                    institution: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    teacher: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        }
                    },
                    students: {
                        select: {
                            id: true,
                            userId: true,
                            birthDate: true,
                            createdAt: true,
                            parent: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                }
                            }
                        },
                        where: {},
                        orderBy: { createdAt: 'asc' }
                    },
                    _count: {
                        select: {
                            students: true
                        }
                    }
                }
            });
            if (!classroom) {
                return res.status(404).json({
                    success: false,
                    message: 'Aula no encontrada'
                });
            }
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                req.user.role !== types_1.UserRole.ADMIN &&
                classroom.institutionId !== req.user.institutionId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver esta aula'
                });
            }
            res.json({
                success: true,
                data: { classroom }
            });
        }
        catch (error) {
            console.error('Error en getById classroom:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async create(req, res) {
        try {
            const { error, value } = createClassroomSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const { name, description, institutionId, teacherId } = value;
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                req.user.role !== types_1.UserRole.ADMIN) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para crear aulas'
                });
            }
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                institutionId !== req.user.institutionId) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo puedes crear aulas en tu institución'
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
            if (teacherId) {
                const teacher = await prisma.user.findUnique({
                    where: {
                        id: teacherId,
                        institutionId: institutionId,
                        role: types_1.UserRole.TUTOR
                    }
                });
                if (!teacher) {
                    return res.status(404).json({
                        success: false,
                        message: 'Profesor no encontrado o no pertenece a la institución'
                    });
                }
            }
            const existingClassroom = await prisma.classroom.findFirst({
                where: {
                    name: { equals: name, mode: 'insensitive' },
                    institutionId
                }
            });
            if (existingClassroom) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un aula con ese nombre en la institución'
                });
            }
            const newClassroom = await prisma.classroom.create({
                data: {
                    name,
                    description,
                    institutionId,
                    teacherId,
                    isActive: true,
                },
                include: {
                    institution: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    teacher: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        }
                    }
                }
            });
            res.status(201).json({
                success: true,
                message: 'Aula creada exitosamente',
                data: { classroom: newClassroom }
            });
        }
        catch (error) {
            console.error('Error en create classroom:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateClassroomSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const existingClassroom = await prisma.classroom.findUnique({
                where: { id }
            });
            if (!existingClassroom) {
                return res.status(404).json({
                    success: false,
                    message: 'Aula no encontrada'
                });
            }
            const canEdit = req.user.role === types_1.UserRole.SUPER_ADMIN ||
                (req.user.role === types_1.UserRole.ADMIN && existingClassroom.institutionId === req.user.institutionId);
            if (!canEdit) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para editar esta aula'
                });
            }
            if (value.name && value.name !== existingClassroom.name) {
                const nameConflict = await prisma.classroom.findFirst({
                    where: {
                        name: { equals: value.name, mode: 'insensitive' },
                        institutionId: existingClassroom.institutionId,
                        id: { not: id }
                    }
                });
                if (nameConflict) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe otra aula con ese nombre en la institución'
                    });
                }
            }
            if (value.teacherId) {
                const teacher = await prisma.user.findUnique({
                    where: {
                        id: value.teacherId,
                        institutionId: existingClassroom.institutionId,
                        role: types_1.UserRole.TUTOR
                    }
                });
                if (!teacher) {
                    return res.status(404).json({
                        success: false,
                        message: 'Profesor no encontrado o no pertenece a la institución'
                    });
                }
            }
            const updatedClassroom = await prisma.classroom.update({
                where: { id },
                data: {
                    ...value,
                    updatedAt: new Date(),
                },
                include: {
                    institution: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    teacher: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        }
                    }
                }
            });
            res.json({
                success: true,
                message: 'Aula actualizada exitosamente',
                data: { classroom: updatedClassroom }
            });
        }
        catch (error) {
            console.error('Error en update classroom:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const classroom = await prisma.classroom.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            students: true
                        }
                    }
                }
            });
            if (!classroom) {
                return res.status(404).json({
                    success: false,
                    message: 'Aula no encontrada'
                });
            }
            const canDelete = req.user.role === types_1.UserRole.SUPER_ADMIN ||
                (req.user.role === types_1.UserRole.ADMIN && classroom.institutionId === req.user.institutionId);
            if (!canDelete) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para eliminar esta aula'
                });
            }
            if (classroom._count.students > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede eliminar un aula que tiene estudiantes. Primero transfiere o desactiva los estudiantes.'
                });
            }
            await prisma.classroom.update({
                where: { id },
                data: {
                    isActive: false,
                    updatedAt: new Date(),
                }
            });
            res.json({
                success: true,
                message: 'Aula desactivada exitosamente'
            });
        }
        catch (error) {
            console.error('Error en delete classroom:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async addStudent(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = addStudentSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const { studentName, birthDate, parentId } = value;
            const classroom = await prisma.classroom.findUnique({
                where: { id }
            });
            if (!classroom) {
                return res.status(404).json({
                    success: false,
                    message: 'Aula no encontrada'
                });
            }
            const canAdd = req.user.role === types_1.UserRole.SUPER_ADMIN ||
                (req.user.role === types_1.UserRole.ADMIN && classroom.institutionId === req.user.institutionId) ||
                (req.user.role === types_1.UserRole.TUTOR && classroom.teacherId === req.user.userId);
            if (!canAdd) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para agregar estudiantes a esta aula'
                });
            }
            if (parentId) {
                const parent = await prisma.user.findUnique({
                    where: {
                        id: parentId,
                        institutionId: classroom.institutionId,
                    }
                });
                if (!parent || (parent.role !== types_1.UserRole.TUTOR && parent.role !== types_1.UserRole.ADMIN)) {
                    return res.status(404).json({
                        success: false,
                        message: 'Padre no encontrado o no puede tener estudiantes asociados'
                    });
                }
            }
            const hashedPassword = await authService_1.AuthService.hashPassword('student123');
            const studentUser = await prisma.user.create({
                data: {
                    email: `${studentName.replace(/\s+/g, '').toLowerCase()}@${classroom.institutionId}.edu`,
                    password: hashedPassword,
                    fullName: studentName,
                    role: types_1.UserRole.CHILD,
                    institutionId: classroom.institutionId,
                    parentId,
                    isActive: true,
                }
            });
            const newStudent = await prisma.student.create({
                data: {
                    userId: studentUser.id,
                    parentId,
                    gradeLevel: 'K',
                    birthDate: birthDate ? new Date(birthDate) : new Date(),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        }
                    },
                    parent: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        }
                    }
                }
            });
            res.status(201).json({
                success: true,
                message: 'Estudiante agregado exitosamente',
                data: { student: newStudent }
            });
        }
        catch (error) {
            console.error('Error en addStudent:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getStats(req, res) {
        try {
            const { id } = req.params;
            const classroom = await prisma.classroom.findUnique({
                where: { id }
            });
            if (!classroom) {
                return res.status(404).json({
                    success: false,
                    message: 'Aula no encontrada'
                });
            }
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                req.user.role !== types_1.UserRole.ADMIN &&
                classroom.institutionId !== req.user.institutionId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver estadísticas de esta aula'
                });
            }
            const [totalStudents, activeStudents,] = await Promise.all([
                prisma.student.count({ where: { classroomId: id } }),
                prisma.student.count({ where: { classroomId: id } }),
            ]);
            const stats = {
                students: { total: totalStudents, active: activeStudents },
            };
            res.json({
                success: true,
                data: { stats }
            });
        }
        catch (error) {
            console.error('Error en getStats classroom:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}
exports.ClassroomController = ClassroomController;
//# sourceMappingURL=classroomController.js.map