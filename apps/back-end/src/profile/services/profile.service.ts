import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

///================REPOSITORIOS=================
import {
  professionalRepository,
  UserWithProfessionalData,
} from '../repository/professional.repository';
import { UserRepository } from '../../auth/repository/user.repository';
import { PersonRepository } from '../../auth/repository/person.repository';
///============================DTOs===========================
import { updateProfileRequestDTO } from '../DTOs/update-profile.request.dto';
import { updateProfileResponseDTO } from '../DTOs/responses/update-profile.response.dto';
import { createProfessionalRequestDTO } from '../DTOs/create-professional.request.dto';
import { createProfessionalResponseDTO } from '../DTOs/responses/create-professional.response.dto';

///==================SERVICIOS========================
import { RoleService } from '../../auth/services/role.service';

///=====================ENTIDADES===================
import { Professional, User } from '@tembiapo/db';
import { createApiResponse } from '../../shared/utils/api-response.factory';
import { ApiResponse } from '@tembiapo/types';
import { getProfessionalResponseDTO } from '../DTOs/responses/get-professional.response.dto';
@Injectable()
export class ProfileService {
  constructor(
    private professionalRepository: professionalRepository,
    private userRepository: UserRepository,
    private personRepository: PersonRepository,
    private roleService: RoleService,
  ) {}

  ///=============METODO PARA CREAR LA CUENTA DE PROFESIONAL=================
  async createProfessionalProfile(
    id: string,
    createProfessionalProfile: createProfessionalRequestDTO,
  ): Promise<ApiResponse<createProfessionalResponseDTO>> {
    const doesTheUserHaveAprofessionalProfile: Professional | null =
      await this.professionalRepository.getProfessionalByUserId(id);

    if (doesTheUserHaveAprofessionalProfile) {
      throw new ConflictException(
        'El usuario ya cuenta con un perfil profesional',
      );
    }

    /// si existe el usuario y no tiene cuenta de profesional, creamos su cuenta
    const newProfessional: Professional =
      await this.professionalRepository.createProfessional(
        id,
        createProfessionalProfile,
      );

    if (newProfessional) {
      const data: createProfessionalResponseDTO = {
        message: 'Profesional creado exitosamente!',
      };
      return createApiResponse(data, true);
    } else {
      throw new ConflictException(
        'Hubo un error a la hora de crear el profesional, por favor intente nuevamente mas tarde',
      );
    }
  }

  ///=============METODO PARA ACTUALIZAR LA BIOGRAFIA Y NUMERO DE CONTACTO DEL PROFESIONAL

  async updateProfile(
    id: string,
    updateProfileRequest: updateProfileRequestDTO,
  ): Promise<ApiResponse<updateProfileResponseDTO>> {
    const user: User | null = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('No existe ningun usuario asociado a ese ID');
    }

    const userRole = await this.roleService.findById(user.roleId);

    if (userRole.name != 'PROFESSIONAL') {
      throw new UnauthorizedException(
        'No cuenta con los permisos suficientes para navegar a esta ruta',
      );
    }

    const professionalToBeUpdated: Professional | null =
      await this.professionalRepository.getProfessionalByUserId(id);

    if (!professionalToBeUpdated) {
      throw new NotFoundException(
        'El ID no esta asociado a ningun profesional',
      );
    }

    const result = await this.professionalRepository.updateProfile(
      professionalToBeUpdated.id,
      updateProfileRequest,
    );

    if (!result) {
      throw new ConflictException(
        'Hubo un error a la hora de actualizar los datos, intente nuevamente en unos minutos.',
      );
    }

    const data: updateProfileResponseDTO = {
      message: 'Datos actualizados correctamente!',
    };

    return createApiResponse(data, true);
  }

  async getProfessional(
    username: string,
  ): Promise<ApiResponse<getProfessionalResponseDTO>> {
    const user: UserWithProfessionalData | null =
      await this.professionalRepository.getAllProfessionalDataByUsername(
        username,
      );

    if (!user || !user.person || !user.professional) {
      throw new NotFoundException(
        'El usuario no existe o no tiene un perfil profesional',
      );
    }

    const data: getProfessionalResponseDTO = {
      professionalId: user.professional.id,
      name: user.person.name,
      lastName: user.person.lastName,
      username: user.username || '',
      isVerified: user.person.isVerified,
      avatarURL: user.avatarUrl || '',
      description: user.professional.description || '',
      whatsappContact: user.professional.whatsappContact,
      area: user.professional.serviceAreas.map((sa) => ({
        id: sa.area.id,
        city: sa.area.city,
        province: sa.area.province,
        country: sa.area.country,
        postalCode: sa.area.postalCode,
        isMain: sa.isMain,
      })),
      fields: user.professional.fields.map((f) => ({
        id: f.field.id,
        name: f.field.name,
        isMain: f.isMain,
      })),
    };

    return createApiResponse(data, true);
  }

  async getAllProfessionals(queryParams: {
    username?: string;
    isVerified?: boolean;
    area?: string;
    field?: string;
    page?: number;
    limit?: number;
  }): Promise<
    ApiResponse<{
      professionals: Array<{
        professionalId: string;
        name: string;
        lastName: string;
        username: string;
        avatarURL: string;
        description: string;
        whatsappContact: string;
        isVerified: boolean;
        area: Array<{
          id: string;
          city: string;
          province: string;
          country: string;
          postalCode: string;
          isMain: boolean;
        }>;
        fields: Array<{
          id: string;
          name: string;
          isMain: boolean;
        }>;
      }>;
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>
  > {
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;

    const { professionals, total } =
      await this.professionalRepository.getAllProfessionals({
        username: queryParams.username,
        isVerified: queryParams.isVerified,
        area: queryParams.area,
        field: queryParams.field,
        page,
        limit,
      });

    const mappedProfessionals = professionals
      .filter((user) => user.person && user.professional)
      .map((user) => ({
        professionalId: user.professional!.id,
        name: user.person.name,
        lastName: user.person.lastName,
        username: user.username || '',
        avatarURL: user.avatarUrl || '',
        description: user.professional!.description || '',
        whatsappContact: user.professional!.whatsappContact,
        isVerified: user.person.isVerified,
        area: user.professional!.serviceAreas.map((sa) => ({
          id: sa.area.id,
          city: sa.area.city,
          province: sa.area.province,
          country: sa.area.country,
          postalCode: sa.area.postalCode,
          isMain: sa.isMain,
        })),
        fields: user.professional!.fields.map((f) => ({
          id: f.field.id,
          name: f.field.name,
          isMain: f.isMain,
        })),
      }));

    const totalPages = Math.ceil(total / limit);

    const data = {
      professionals: mappedProfessionals,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };

    return createApiResponse(data, true);
  }
}
