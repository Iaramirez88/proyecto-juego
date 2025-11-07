import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/authService';
import Joi from 'joi';
import { UserRole } from '../types';

const prisma = new PrismaClient();

// Esquemas de validación
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('ADMIN', 'TEACHER', 'PARENT').required(),
  institutionId: Joi.string().uuid().optional(),
  parentId: Joi.string().uuid().optional(), // Para crear cuentas de hijos
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export class AuthController {
  /**
   * POST /api/auth/register
   * Registrar nuevo usuario
   */
  static async register(req: Request, res: Response) {
    try {
      // Validar datos de entrada
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.details.map(d => d.message)
        });
      }

      const { email, password, fullName, role, institutionId, parentId } = value;

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'El usuario ya existe con ese email'
        });
      }

      // Validar password
      const passwordValidation = AuthService.isValidPassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Password no cumple los requisitos',
          errors: passwordValidation.errors
        });
      }

      // Hash del password
      const hashedPassword = await AuthService.hashPassword(password);

      // Crear usuario
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          role: role as UserRole,
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

      // Generar token JWT
      const token = AuthService.generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role as UserRole,
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

    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/auth/login
   * Autenticar usuario
   */
  static async login(req: Request, res: Response) {
    try {
      // Validar datos de entrada
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.details.map(d => d.message)
        });
      }

      const { email, password } = value;

      // Buscar usuario por email
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

      // Verificar que el usuario esté activo
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Usuario inactivo. Contacta al administrador.'
        });
      }

      // Verificar password
      const isPasswordValid = await AuthService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar token JWT
      const token = AuthService.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role as UserRole,
        institutionId: user.institutionId || undefined,
      });

      // Actualizar último login
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

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Cerrar sesión (invalidar token - implementación futura con blacklist)
   */
  static async logout(req: Request, res: Response) {
    try {
      // TODO: Implementar blacklist de tokens para invalidar
      // Por ahora solo respondemos éxito, el token se invalida en el frontend
      
      res.json({
        success: true,
        message: 'Logout exitoso'
      });

    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/auth/profile
   * Obtener perfil del usuario autenticado
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user; // Viene del middleware de autenticación

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

    } catch (error) {
      console.error('Error en getProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/auth/profile
   * Actualizar perfil del usuario autenticado
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      
      const updateSchema = Joi.object({
        fullName: Joi.string().min(2).max(100).optional(),
        email: Joi.string().email().optional(),
        currentPassword: Joi.string().optional(),
        newPassword: Joi.string().min(8).optional(),
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

      // Si se quiere cambiar email, verificar que no exista otro usuario con ese email
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

      // Si se quiere cambiar password, validar el actual
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

        const isCurrentPasswordValid = await AuthService.comparePassword(
          currentPassword, 
          user!.password
        );

        if (!isCurrentPasswordValid) {
          return res.status(400).json({
            success: false,
            message: 'Password actual incorrecto'
          });
        }

        const passwordValidation = AuthService.isValidPassword(newPassword);
        if (!passwordValidation.isValid) {
          return res.status(400).json({
            success: false,
            message: 'Nuevo password no cumple los requisitos',
            errors: passwordValidation.errors
          });
        }

        hashedNewPassword = await AuthService.hashPassword(newPassword);
      }

      // Actualizar usuario
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

    } catch (error) {
      console.error('Error en updateProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}