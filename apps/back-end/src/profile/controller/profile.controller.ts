import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Put,
  Req,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { updateProfileRequestDTO } from '../DTOs/update-profile.request.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/role.guard';
import { Roles } from '../../shared/decorators/role.decorator';
import { ProfileService } from '../services/profile.service';
import { createProfessionalRequestDTO } from '../DTOs/create-professional.request.dto';
import { API_PREFIX } from '../../app.controller';

@ApiTags('Profile')
@Controller(`${API_PREFIX}/profile`)
@ApiTags('Profile')
@Controller(`${API_PREFIX}/profile`)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROFESSIONAL')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() updateProfileRequest: updateProfileRequestDTO,
    @Req() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: string = req.user.userId as string;
    return await this.profileService.updateProfile(
      userId,
      updateProfileRequest,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyProfessionalProfile(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: string = req.user.userId as string;
    return await this.profileService.getProfessionalMe(userId);
  }

  @Post('professional')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProfessional(
    @Body() createProfesionalRequest: createProfessionalRequestDTO,
    @Req() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: string = req.user.userId as string;
    return await this.profileService.createProfessionalProfile(
      userId,
      createProfesionalRequest,
    );
  }

  @Get('all-professionals')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener todos los profesionales',
    description:
      'Obtiene una lista paginada de profesionales con filtros opcionales por username, estado de verificación, área de servicio y rubro.',
  })
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
    description:
      'Filtrar por nombre de usuario (búsqueda parcial, case-insensitive)',
    example: 'juan',
  })
  @ApiQuery({
    name: 'isVerified',
    required: false,
    type: Boolean,
    description: 'Filtrar por estado de verificación',
    example: true,
  })
  @ApiQuery({
    name: 'area',
    required: false,
    type: String,
    description: 'Filtrar por ID del área de servicio (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'field',
    required: false,
    type: String,
    description: 'Filtrar por ID del rubro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Lista de profesionales obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            professionals: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  professionalId: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174002',
                  },
                  name: { type: 'string', example: 'Juan' },
                  lastName: { type: 'string', example: 'Pérez' },
                  username: { type: 'string', example: 'juanperez' },
                  avatarURL: {
                    type: 'string',
                    example: 'https://example.com/avatar.jpg',
                  },
                  description: {
                    type: 'string',
                    example: 'Profesional con 10 años de experiencia',
                  },
                  whatsappContact: { type: 'string', example: '+595981234567' },
                  isVerified: { type: 'boolean', example: true },
                  area: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        city: { type: 'string', example: 'Asunción' },
                        province: { type: 'string', example: 'Asunción' },
                        country: { type: 'string', example: 'Paraguay' },
                        postalCode: { type: 'string', example: '1234' },
                        isMain: { type: 'boolean', example: true },
                      },
                    },
                  },
                  fields: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string', example: 'Carpintero' },
                        isMain: { type: 'boolean', example: true },
                      },
                    },
                  },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 50 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                totalPages: { type: 'number', example: 5 },
              },
            },
          },
        },
        success: { type: 'boolean', example: true },
      },
    },
  })
  async getAllProfessionals(
    @Query()
    query: {
      username?: string;
      isVerified?: string;
      area?: string;
      field?: string;
      page?: string;
      limit?: string;
    },
  ) {
    // Convert string query params to appropriate types
    const queryParams = {
      username: query.username,
      isVerified:
        query.isVerified === 'true'
          ? true
          : query.isVerified === 'false'
            ? false
            : undefined,
      area: query.area,
      field: query.field,
      page: query.page ? parseInt(query.page, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
    };

    return await this.profileService.getAllProfessionals(queryParams);
  }

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  async getProfessional(@Param('username') username: string) {
    return await this.profileService.getProfessional(username);
  }
}
