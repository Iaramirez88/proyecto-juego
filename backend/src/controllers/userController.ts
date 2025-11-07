import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/authService';
import Joi from 'joi';
import { AuthenticatedRequest, UserRole } from '../types';

const prisma = new PrismaClient();

// Esquemas de validación
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('ADMIN', 'TEACHER', 'PARENT', 'CHILD').required(),
  institutionId: Joi.string().uuid().required(),
  parentId: Joi.string().uuid().optional(),
});

const updateUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('ADMIN', 'TEACHER', 'PARENT', 'CHILD').optional(),
  institutionId: Joi.string().uuid().optional(),
  parentId: Joi.string().uuid().optional(),
  isActive: Joi.boolean().optional(),
});

export class UserController {
  /**
   * GET /api/users
   * Obtener usuarios con filtros y paginación
   */
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 10, search, role, institutionId, isActive } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};

      // Filtro por institución (usuarios no SUPER_ADMIN solo ven su institución)
      if (req.user!.role !== UserRole.SUPER_ADMIN) {
        whereClause.institutionId = req.user!.institutionId;
      } else if (institutionId) {
        whereClause.institutionId = String(institutionId);
      }

      // Filtro por búsqueda
      if (search) {
        whereClause.OR = [
          { fullName: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      // Filtro por rol
      if (role) {
        whereClause.role = String(role);
      }

      // Filtro por estado activo
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

    } catch (error) {
      console.error('Error en getAll users:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/users/:id
   * Obtener un usuario por ID
   */
  static async getById(req: AuthenticatedRequest, res: Response) {
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

      // Verificar permisos de acceso
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          req.user!.role !== UserRole.ADMIN && 
          req.user!.userId !== id && 
          user.institutionId !== req.user!.institutionId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver este usuario'
        });
      }

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      console.error('Error en getById user:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/users
   * Crear nuevo usuario
   */
  static async create(req: AuthenticatedRequest, res: Response) {
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

      // Verificar permisos para crear usuario
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para crear usuarios'
        });
      }

      // Verificar que no sea SUPER_ADMIN si no eres SUPER_ADMIN
      if (role === 'SUPER_ADMIN' && req.user!.role !== UserRole.SUPER_ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'No puedes crear usuarios SUPER_ADMIN'
        });
      }

      // Si no eres SUPER_ADMIN, solo puedes crear en tu institución
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          institutionId !== req.user!.institutionId) {
        return res.status(403).json({
          success: false,
          message: 'Solo puedes crear usuarios en tu institución'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un usuario con ese email'
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

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: { user: newUser }
      });

    } catch (error) {
      console.error('Error en create user:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/users/:id
   * Actualizar usuario
   */
  static async update(req: AuthenticatedRequest, res: Response) {
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

      // Verificar que el usuario existe
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar permisos
      const canEdit = req.user!.role === UserRole.SUPER_ADMIN ||
                     (req.user!.role === UserRole.ADMIN && existingUser.institutionId === req.user!.institutionId) ||
                     req.user!.userId === id;

      if (!canEdit) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para editar este usuario'
        });
      }

      // Si se está cambiando email, verificar que no exista
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

      // Verificar que no se esté intentando cambiar a SUPER_ADMIN sin permisos
      if (value.role === 'SUPER_ADMIN' && req.user!.role !== UserRole.SUPER_ADMIN) {
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

    } catch (error) {
      console.error('Error en update user:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * DELETE /api/users/:id
   * Eliminar usuario (soft delete)
   */
  static async delete(req: AuthenticatedRequest, res: Response) {
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

      // Verificar permisos
      const canDelete = req.user!.role === UserRole.SUPER_ADMIN ||
                       (req.user!.role === UserRole.ADMIN && user.institutionId === req.user!.institutionId);

      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para eliminar este usuario'
        });
      }

      // No permitir auto-eliminación
      if (req.user!.userId === id) {
        return res.status(400).json({
          success: false,
          message: 'No puedes eliminar tu propia cuenta'
        });
      }

      // Soft delete
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

    } catch (error) {
      console.error('Error en delete user:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/users/:id/children
   * Obtener hijos de un usuario (para padres)
   */
  static async getChildren(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Verificar permisos
      if (req.user!.userId !== id && req.user!.role !== UserRole.ADMIN) {
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

    } catch (error) {
      console.error('Error en getChildren:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/users/:id/change-password
   * Cambiar password de usuario (solo admins o el propio usuario)
   */
  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const changePasswordSchema = Joi.object({
        currentPassword: Joi.string().when('isAdmin', {
          is: false,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        newPassword: Joi.string().min(8).required(),
      });

      const isAdmin = req.user!.role === UserRole.SUPER_ADMIN || req.user!.role === UserRole.ADMIN;
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

      // Verificar permisos
      const canChange = req.user!.userId === id || 
                       (isAdmin && user.institutionId === req.user!.institutionId) ||
                       req.user!.role === UserRole.SUPER_ADMIN;

      if (!canChange) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para cambiar el password de este usuario'
        });
      }

      // Si no es admin, verificar password actual
      if (!isAdmin && currentPassword) {
        const isCurrentPasswordValid = await AuthService.comparePassword(
          currentPassword, 
          user.password
        );

        if (!isCurrentPasswordValid) {
          return res.status(400).json({
            success: false,
            message: 'Password actual incorrecto'
          });
        }
      }

      // Validar nuevo password
      const passwordValidation = AuthService.isValidPassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Nuevo password no cumple los requisitos',
          errors: passwordValidation.errors
        });
      }

      // Hash del nuevo password
      const hashedNewPassword = await AuthService.hashPassword(newPassword);

      // Actualizar password
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

    } catch (error) {
      console.error('Error en changePassword:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}