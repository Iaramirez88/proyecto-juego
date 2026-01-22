"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const authService_1 = require("../services/authService");
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
const registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    fullName: joi_1.default.string().min(2).max(100).required(),
    role: joi_1.default.string().valid('ADMIN', 'TEACHER', 'PARENT').required(),
    institutionId: joi_1.default.string().uuid().optional(),
    parentId: joi_1.default.string().uuid().optional(),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
class AuthController {
    static async register(req, res) {
        try {
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const { email, password, fullName, role, institutionId, parentId } = value;
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'El usuario ya existe con ese email'
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
            const token = authService_1.AuthService.generateToken({
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role,
                institutionId: newUser.institutionId || undefined,
            });
            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    user: newUser,
                    token,
                }
            });
        }
        catch (error) {
            console.error('Error en register:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const { email, password } = value;
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    institution: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Usuario inactivo. Contacta al administrador.'
                });
            }
            const isPasswordValid = await authService_1.AuthService.comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }
            const token = authService_1.AuthService.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
                institutionId: user.institutionId || undefined,
            });
            await prisma.user.update({
                where: { id: user.id },
                data: { updatedAt: new Date() }
            });
            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        fullName: user.fullName,
                        role: user.role,
                        institutionId: user.institutionId,
                        parentId: user.parentId,
                        institution: user.institution || null,
                    },
                    token,
                }
            });
        }
        catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async logout(req, res) {
        try {
            res.json({
                success: true,
                message: 'Logout exitoso'
            });
        }
        catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async getProfile(req, res) {
        try {
            const { userId } = req.user;
            const user = await prisma.user.findUnique({
                where: { id: userId },
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
                }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            res.json({
                success: true,
                data: { user }
            });
        }
        catch (error) {
            console.error('Error en getProfile:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            const { userId } = req.user;
            const updateSchema = joi_1.default.object({
                fullName: joi_1.default.string().min(2).max(100).optional(),
                email: joi_1.default.string().email().optional(),
                currentPassword: joi_1.default.string().optional(),
                newPassword: joi_1.default.string().min(8).optional(),
            });
            const { error, value } = updateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.details.map(d => d.message)
                });
            }
            const { fullName, email, currentPassword, newPassword } = value;
            if (email) {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email,
                        id: { not: userId }
                    }
                });
                if (existingUser) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe otro usuario con ese email'
                    });
                }
            }
            let hashedNewPassword;
            if (newPassword) {
                if (!currentPassword) {
                    return res.status(400).json({
                        success: false,
                        message: 'Se requiere el password actual para cambiarlo'
                    });
                }
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { password: true }
                });
                const isCurrentPasswordValid = await authService_1.AuthService.comparePassword(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Password actual incorrecto'
                    });
                }
                const passwordValidation = authService_1.AuthService.isValidPassword(newPassword);
                if (!passwordValidation.isValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Nuevo password no cumple los requisitos',
                        errors: passwordValidation.errors
                    });
                }
                hashedNewPassword = await authService_1.AuthService.hashPassword(newPassword);
            }
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(fullName && { fullName }),
                    ...(email && { email }),
                    ...(hashedNewPassword && { password: hashedNewPassword }),
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
                message: 'Perfil actualizado exitosamente',
                data: { user: updatedUser }
            });
        }
        catch (error) {
            console.error('Error en updateProfile:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map