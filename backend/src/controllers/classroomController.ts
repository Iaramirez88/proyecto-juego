import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { AuthenticatedRequest, UserRole } from '../types';
import { AuthService } from '../services/authService';

const prisma = new PrismaClient();

// Esquemas de validación
const createClassroomSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  institutionId: Joi.string().uuid().required(),
  teacherId: Joi.string().uuid().optional(),
});

const updateClassroomSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  teacherId: Joi.string().uuid().optional().allow(null),
  isActive: Joi.boolean().optional(),
});

const addStudentSchema = Joi.object({
  studentName: Joi.string().min(2).max(100).required(),
  birthDate: Joi.date().optional(),
  parentId: Joi.string().uuid().optional(),
});

export class ClassroomController {
  /**
   * GET /api/classrooms
   * Obtener aulas con filtros y paginación
   */
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 10, search, institutionId, teacherId, isActive } = req.query;
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
          { name: { contains: String(search), mode: 'insensitive' } },
          { description: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      // Filtro por profesor
      if (teacherId) {
        whereClause.teacherId = String(teacherId);
      }

      // Filtro por estado activo
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

    } catch (error) {
      console.error('Error en getAll classrooms:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/classrooms/:id
   * Obtener un aula por ID con sus estudiantes
   */
  static async getById(req: AuthenticatedRequest, res: Response) {
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

      // Verificar permisos de acceso
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          req.user!.role !== UserRole.ADMIN && 
          classroom.institutionId !== req.user!.institutionId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver esta aula'
        });
      }

      res.json({
        success: true,
        data: { classroom }
      });

    } catch (error) {
      console.error('Error en getById classroom:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/classrooms
   * Crear nueva aula
   */
  static async create(req: AuthenticatedRequest, res: Response) {
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

      // Verificar permisos
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para crear aulas'
        });
      }

      // Si no eres SUPER_ADMIN, solo puedes crear en tu institución
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          institutionId !== req.user!.institutionId) {
        return res.status(403).json({
          success: false,
          message: 'Solo puedes crear aulas en tu institución'
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

      // Si se especifica profesor, verificar que existe y pertenece a la institución
      if (teacherId) {
        const teacher = await prisma.user.findUnique({
          where: { 
            id: teacherId,
            institutionId: institutionId,
            role: UserRole.TUTOR
          }
        });

        if (!teacher) {
          return res.status(404).json({
            success: false,
            message: 'Profesor no encontrado o no pertenece a la institución'
          });
        }
      }

      // Verificar que no existe otra aula con el mismo nombre en la institución
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

    } catch (error) {
      console.error('Error en create classroom:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/classrooms/:id
   * Actualizar aula
   */
  static async update(req: AuthenticatedRequest, res: Response) {
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

      // Verificar que el aula existe
      const existingClassroom = await prisma.classroom.findUnique({
        where: { id }
      });

      if (!existingClassroom) {
        return res.status(404).json({
          success: false,
          message: 'Aula no encontrada'
        });
      }

      // Verificar permisos
      const canEdit = req.user!.role === UserRole.SUPER_ADMIN ||
                     (req.user!.role === UserRole.ADMIN && existingClassroom.institutionId === req.user!.institutionId);

      if (!canEdit) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para editar esta aula'
        });
      }

      // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
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

      // Si se está asignando profesor, verificar que existe y pertenece a la institución
      if (value.teacherId) {
        const teacher = await prisma.user.findUnique({
          where: { 
            id: value.teacherId,
            institutionId: existingClassroom.institutionId,
            role: UserRole.TUTOR
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

    } catch (error) {
      console.error('Error en update classroom:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * DELETE /api/classrooms/:id
   * Eliminar aula (soft delete)
   */
  static async delete(req: AuthenticatedRequest, res: Response) {
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

      // Verificar permisos
      const canDelete = req.user!.role === UserRole.SUPER_ADMIN ||
                       (req.user!.role === UserRole.ADMIN && classroom.institutionId === req.user!.institutionId);

      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para eliminar esta aula'
        });
      }

      // Verificar si tiene estudiantes activos
      if (classroom._count.students > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar un aula que tiene estudiantes. Primero transfiere o desactiva los estudiantes.'
        });
      }

      // Soft delete
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

    } catch (error) {
      console.error('Error en delete classroom:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/classrooms/:id/students
   * Agregar estudiante al aula
   */
  static async addStudent(req: AuthenticatedRequest, res: Response) {
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

      // Verificar que el aula existe
      const classroom = await prisma.classroom.findUnique({
        where: { id }
      });

      if (!classroom) {
        return res.status(404).json({
          success: false,
          message: 'Aula no encontrada'
        });
      }

      // Verificar permisos
      const canAdd = req.user!.role === UserRole.SUPER_ADMIN ||
                    (req.user!.role === UserRole.ADMIN && classroom.institutionId === req.user!.institutionId) ||
                    (req.user!.role === UserRole.TUTOR && classroom.teacherId === req.user!.userId);

      if (!canAdd) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para agregar estudiantes a esta aula'
        });
      }

      // Si se especifica padre, verificar que existe y puede tener hijos
      if (parentId) {
        const parent = await prisma.user.findUnique({
          where: { 
            id: parentId,
            institutionId: classroom.institutionId,
          }
        });

        if (!parent || (parent.role !== UserRole.TUTOR && parent.role !== UserRole.ADMIN)) {
          return res.status(404).json({
            success: false,
            message: 'Padre no encontrado o no puede tener estudiantes asociados'
          });
        }
      }

      // Primero crear el usuario estudiante
      const hashedPassword = await AuthService.hashPassword('student123'); // Password temporal
      const studentUser = await prisma.user.create({
        data: {
          email: `${studentName.replace(/\s+/g, '').toLowerCase()}@${classroom.institutionId}.edu`,
          password: hashedPassword,
          fullName: studentName,
          role: UserRole.CHILD,
          institutionId: classroom.institutionId,
          parentId,
          isActive: true,
        }
      });

      // Luego crear el registro de estudiante
      const newStudent = await prisma.student.create({
        data: {
          userId: studentUser.id,
          parentId,
          gradeLevel: 'K', // Grade level por defecto
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

    } catch (error) {
      console.error('Error en addStudent:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/classrooms/:id/stats
   * Obtener estadísticas del aula
   */
  static async getStats(req: AuthenticatedRequest, res: Response) {
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

      // Verificar permisos
      if (req.user!.role !== UserRole.SUPER_ADMIN && 
          req.user!.role !== UserRole.ADMIN && 
          classroom.institutionId !== req.user!.institutionId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver estadísticas de esta aula'
        });
      }

      const [
        totalStudents,
        activeStudents,
      ] = await Promise.all([
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

    } catch (error) {
      console.error('Error en getStats classroom:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}