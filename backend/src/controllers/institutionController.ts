import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

// Esquemas de validación
const createInstitutionSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(500).optional(),
  address: Joi.string().max(300).optional(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
});

const updateInstitutionSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(500).optional(),
  address: Joi.string().max(300).optional(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
});

export class InstitutionController {
  /**
   * GET /api/institutions
   * Obtener todas las instituciones (solo ADMIN)
   */
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
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

    } catch (error) {
      console.error('Error en getAll institutions:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/institutions/:id
   * Obtener una institución por ID
   */
  static async getById(req: AuthenticatedRequest, res: Response) {
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

    } catch (error) {
      console.error('Error en getById institution:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/institutions
   * Crear nueva institución (solo ADMIN)
   */
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { error, value } = createInstitutionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.details.map(d => d.message)
        });
      }

      // Verificar si ya existe una institución con el mismo nombre
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
          createdBy: req.user!.userId,
        }
      });

      res.status(201).json({
        success: true,
        message: 'Institución creada exitosamente',
        data: { institution: newInstitution }
      });

    } catch (error) {
      console.error('Error en create institution:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/institutions/:id
   * Actualizar institución
   */
  static async update(req: AuthenticatedRequest, res: Response) {
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

      // Verificar que la institución existe
      const existingInstitution = await prisma.institution.findUnique({
        where: { id }
      });

      if (!existingInstitution) {
        return res.status(404).json({
          success: false,
          message: 'Institución no encontrada'
        });
      }

      // Si se está cambiando el nombre, verificar que no exista otra con ese nombre
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

    } catch (error) {
      console.error('Error en update institution:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * DELETE /api/institutions/:id
   * Eliminar institución (soft delete)
   */
  static async delete(req: AuthenticatedRequest, res: Response) {
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

      // Verificar si tiene usuarios activos o aulas
      if (institution._count.users > 0 || institution._count.classrooms > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar una institución que tiene usuarios o aulas asociadas'
        });
      }

      // Soft delete
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

    } catch (error) {
      console.error('Error en delete institution:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/institutions/:id/stats
   * Obtener estadísticas de la institución
   */
  static async getStats(req: AuthenticatedRequest, res: Response) {
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

      const [
        totalUsers,
        activeUsers,
        totalClassrooms,
        activeClassrooms,
        totalStudents,
        activeStudents,
        activeSubscriptions
      ] = await Promise.all([
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

    } catch (error) {
      console.error('Error en getStats institution:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}