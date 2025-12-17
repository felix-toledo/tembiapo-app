import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Professional, Prisma } from '@tembiapo/db';
import { updateProfileRequestDTO } from '../DTOs/update-profile.request.dto';
import { createProfessionalRequestDTO } from '../DTOs/create-professional.request.dto';

// Type for User with all professional data included
export type UserWithProfessionalData = Prisma.UserGetPayload<{
  include: {
    person: true;
    professional: {
      include: {
        serviceAreas: {
          include: {
            area: true;
          };
        };
        fields: {
          include: {
            field: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class professionalRepository {
  constructor(private prisma: PrismaService) {}

  async createProfessional(
    userId: string,
    createProfessionalProfile: createProfessionalRequestDTO,
  ): Promise<Professional> {
    return await this.prisma.professional.create({
      data: {
        description: createProfessionalProfile.biography,
        whatsappContact: createProfessionalProfile.whatsappContact,
        createdAt: new Date(),
        userId: userId,
        // Create field relationships
        fields: {
          create: createProfessionalProfile.fields.map((field) => ({
            fieldId: field.id,
            isMain: field.isMain,
          })),
        },
        // Create service area relationships
        serviceAreas: {
          create: createProfessionalProfile.serviceAreas.map((area) => ({
            areaId: area.id,
            isMain: area.isMain,
          })),
        },
      },
    });
  }

  ///metodo para buscar un profesional por ID de usuario (este podemos buscarlo por el user id del JWT)
  async getProfessionalByUserId(id: string): Promise<Professional | null> {
    return await this.prisma.professional.findFirst({
      where: { userId: id },
    });
  }

  ///metodo para actualizar la biografia, numero de contacto, fields y service areas
  async updateProfile(
    id: string,
    updateProfileRequest: updateProfileRequestDTO,
  ): Promise<boolean> {
    // Use a transaction to ensure all updates succeed or fail together
    await this.prisma.$transaction(async (tx) => {
      // Update basic professional info
      await tx.professional.update({
        where: { id },
        data: {
          description: updateProfileRequest.biography,
          whatsappContact: updateProfileRequest.whatsappContact,
        },
      });

      // Update fields if provided
      if (updateProfileRequest.fields) {
        // Delete existing field relationships
        await tx.fieldProfessional.deleteMany({
          where: { professionalId: id },
        });

        // Create new field relationships
        if (updateProfileRequest.fields.length > 0) {
          await tx.fieldProfessional.createMany({
            data: updateProfileRequest.fields.map((field) => ({
              professionalId: id,
              fieldId: field.id,
              isMain: field.isMain,
            })),
          });
        }
      }

      // Update service areas if provided
      if (updateProfileRequest.serviceAreas) {
        // Delete existing service area relationships
        await tx.areaProfessional.deleteMany({
          where: { professionalId: id },
        });

        // Create new service area relationships
        if (updateProfileRequest.serviceAreas.length > 0) {
          await tx.areaProfessional.createMany({
            data: updateProfileRequest.serviceAreas.map((area) => ({
              professionalId: id,
              areaId: area.id,
              isMain: area.isMain,
            })),
          });
        }
      }
    });

    return true;
  }

  async getAllProfessionalDataByUsername(
    username: string,
  ): Promise<UserWithProfessionalData | null> {
    return await this.prisma.user.findFirst({
      where: { username },
      include: {
        person: true,
        professional: {
          include: {
            serviceAreas: {
              include: {
                area: true,
              },
            },
            fields: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });
  }

  async getAllProfessionalDataByUserId(
    userId: string,
  ): Promise<UserWithProfessionalData | null> {
    return await this.prisma.user.findFirst({
      where: { id: userId },
      include: {
        person: true,
        professional: {
          include: {
            serviceAreas: {
              include: {
                area: true,
              },
            },
            fields: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });
  }

  async getAllProfessionals(filters: {
    username?: string;
    isVerified?: boolean;
    area?: string;
    field?: string;
    page: number;
    limit: number;
  }): Promise<{
    professionals: UserWithProfessionalData[];
    total: number;
  }> {
    const { username, isVerified, area, field, page, limit } = filters;

    // Build dynamic where conditions
    const whereConditions: Prisma.UserWhereInput = {
      professional: {
        isNot: null, // Only users with professional profiles
      },
    };

    // Filter by username (partial match)
    if (username) {
      whereConditions.username = {
        contains: username,
        mode: 'insensitive',
      };
    }

    // Filter by verification status
    if (isVerified !== undefined) {
      whereConditions.person = {
        isVerified: isVerified,
      };
    }

    // Build professional conditions separately
    const professionalConditions: Prisma.ProfessionalWhereInput = {};

    // Filter by service area
    if (area) {
      professionalConditions.serviceAreas = {
        some: {
          areaId: area,
        },
      };
    }

    // Filter by field
    if (field) {
      professionalConditions.fields = {
        some: {
          fieldId: field,
        },
      };
    }

    // Combine professional conditions if any exist
    if (Object.keys(professionalConditions).length > 0) {
      whereConditions.professional = {
        ...professionalConditions,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [professionals, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereConditions,
        include: {
          person: true,
          professional: {
            include: {
              serviceAreas: {
                include: {
                  area: true,
                },
              },
              fields: {
                include: {
                  field: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: whereConditions,
      }),
    ]);

    return { professionals, total };
  }
}
