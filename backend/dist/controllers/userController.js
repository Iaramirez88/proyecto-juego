"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const authService_1 = require("../services/authService");
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const prisma = new client_1.PrismaClient();
const createUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    fullName: joi_1.default.string().min(2).max(100).required(),
    role: joi_1.default.string().valid('ADMIN', 'TEACHER', 'PARENT', 'CHILD').required(),
    institutionId: joi_1.default.string().uuid().required(),
    parentId: joi_1.default.string().uuid().optional(),
});
const updateUserSchema = joi_1.default.object({
    fullName: joi_1.default.string().min(2).max(100).optional(),
    email: joi_1.default.string().email().optional(),
    role: joi_1.default.string().valid('ADMIN', 'TEACHER', 'PARENT', 'CHILD').optional(),
    institutionId: joi_1.default.string().uuid().optional(),
    parentId: joi_1.default.string().uuid().optional(),
    isActive: joi_1.default.boolean().optional(),
});
class UserController {
    static async getAll(req, res) {
        try {
            const { page = 1, limit = 10, search, role, institutionId, isActive } = req.query;
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
                    { fullName: { contains: String(search), mode: 'insensitive' } },
                    { email: { contains: String(search), mode: 'insensitive' } },
                ];
            }
            if (role) {
                whereClause.role = String(role);
            }
            if (isActive !== undefined) {
                whereClause.isActive = isActive === 'true';
            }
            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where: whereClause,
                    skip,
                    take: Number(limit),
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        role: true,
                        institutionId: true,
                        parentId: true,
                        isActive: true,
                        createdAt: true,
                        updatedAt: true,
                        institution: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                        parent: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.user.count({ where: whereClause })
            ]);
            res.json({
                success: true,
                data: {
                    users,
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
            console.error('Error en getAll users:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    role: true,
                    institutionId: true,
                    parentId: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                    institution: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    parent: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        }
                    },
                    children: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            isActive: true,
                        },
                        where: { isActive: true }
                    }
                }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                req.user.role !== types_1.UserRole.ADMIN &&
                req.user.userId !== id &&
                user.institutionId !== req.user.institutionId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver este usuario'
                });
            }
            res.json({
                success: true,
                data: { user }
            });
        }
        catch (error) {
            console.error('Error en getById user:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async create(req, res) {
        try {
            const { error, value } = createUserSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const { email, password, fullName, role, institutionId, parentId } = value;
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                req.user.role !== types_1.UserRole.ADMIN) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para crear usuarios'
                });
            }
            if (role === 'SUPER_ADMIN' && req.user.role !== types_1.UserRole.SUPER_ADMIN) {
                return res.status(403).json({
                    success: false,
                    message: 'No puedes crear usuarios SUPER_ADMIN'
                });
            }
            if (req.user.role !== types_1.UserRole.SUPER_ADMIN &&
                institutionId !== req.user.institutionId) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo puedes crear usuarios en tu institución'
                });
            }
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un usuario con ese email'
                });
            }
            const passwordValidation = authService_1.AuthService.isValidPassword(password);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Password no cumple los requisitos',
                    errors: passwordValidation.errors
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
            const hashedPassword = await authService_1.AuthService.hashPassword(password);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    fullName,
                    role: role,
                    institutionId,
                    parentId,
                    isActive: true,
                },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    role: true,
                    institutionId: true,
                    parentId: true,
                    isActive: true,
                    createdAt: true,
                }
            });
            res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                data: { user: newUser }
            });
        }
        catch (error) {
            console.error('Error en create user:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateUserSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const existingUser = await prisma.user.findUnique({
                where: { id }
            });
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            const canEdit = req.user.role === types_1.UserRole.SUPER_ADMIN ||
                (req.user.role === types_1.UserRole.ADMIN && existingUser.institutionId === req.user.institutionId) ||
                req.user.userId === id;
            if (!canEdit) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para editar este usuario'
                });
            }
            if (value.email && value.email !== existingUser.email) {
                const emailConflict = await prisma.user.findFirst({
                    where: {
                        email: value.email,
                        id: { not: id }
                    }
                });
                if (emailConflict) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe otro usuario con ese email'
                    });
                }
            }
            if (value.role === 'SUPER_ADMIN' && req.user.role !== types_1.UserRole.SUPER_ADMIN) {
                return res.status(403).json({
                    success: false,
                    message: 'No puedes asignar el rol SUPER_ADMIN'
                });
            }
            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    ...value,
                    updatedAt: new Date(),
                },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    role: true,
                    institutionId: true,
                    parentId: true,
                    isActive: true,
                    updatedAt: true,
                }
            });
            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: { user: updatedUser }
            });
        }
        catch (error) {
            console.error('Error en update user:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            const canDelete = req.user.role === types_1.UserRole.SUPER_ADMIN ||
                (req.user.role === types_1.UserRole.ADMIN && user.institutionId === req.user.institutionId);
            if (!canDelete) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para eliminar este usuario'
                });
            }
            if (req.user.userId === id) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes eliminar tu propia cuenta'
                });
            }
            await prisma.user.update({
                where: { id },
                data: {
                    isActive: false,
                    updatedAt: new Date(),
                }
            });
            res.json({
                success: true,
                message: 'Usuario desactivado exitosamente'
            });
        }
        catch (error) {
            console.error('Error en delete user:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getChildren(req, res) {
        try {
            const { id } = req.params;
            if (req.user.userId !== id && req.user.role !== types_1.UserRole.ADMIN) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver los hijos de este usuario'
                });
            }
            const children = await prisma.user.findMany({
                where: {
                    parentId: id,
                    isActive: true
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                }
            });
            res.json({
                success: true,
                data: { children }
            });
        }
        catch (error) {
            console.error('Error en getChildren:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async changePassword(req, res) {
        try {
            const { id } = req.params;
            const changePasswordSchema = joi_1.default.object({
                currentPassword: joi_1.default.string().when('isAdmin', {
                    is: false,
                    then: joi_1.default.required(),
                    otherwise: joi_1.default.optional()
                }),
                newPassword: joi_1.default.string().min(8).required(),
            });
            const isAdmin = req.user.role === types_1.UserRole.SUPER_ADMIN || req.user.role === types_1.UserRole.ADMIN;
            const { error, value } = changePasswordSchema.validate({
                ...req.body,
                isAdmin
            });
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const { currentPassword, newPassword } = value;
            const user = await prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            const canChange = req.user.userId === id ||
                (isAdmin && user.institutionId === req.user.institutionId) ||
                req.user.role === types_1.UserRole.SUPER_ADMIN;
            if (!canChange) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para cambiar el password de este usuario'
                });
            }
            if (!isAdmin && currentPassword) {
                const isCurrentPasswordValid = await authService_1.AuthService.comparePassword(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Password actual incorrecto'
                    });
                }
            }
            const passwordValidation = authService_1.AuthService.isValidPassword(newPassword);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Nuevo password no cumple los requisitos',
                    errors: passwordValidation.errors
                });
            }
            const hashedNewPassword = await authService_1.AuthService.hashPassword(newPassword);
            await prisma.user.update({
                where: { id },
                data: {
                    password: hashedNewPassword,
                    updatedAt: new Date(),
                }
            });
            res.json({
                success: true,
                message: 'Password actualizado exitosamente'
            });
        }
        catch (error) {
            console.error('Error en changePassword:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map