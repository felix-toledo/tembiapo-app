import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../auth/repository/user.repository';
import { UserInfoResponseDTO } from './dto/user-info.response.dto';
import { createApiResponse } from '../shared/utils/api-response.factory';
import { ApiResponse } from '@tembiapo/types';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<ApiResponse<any>> {
    const users = await this.userRepository.findAllUsersWithDetails();
    return createApiResponse(users, true);
  }

  async getUserInfo(userId: string): Promise<ApiResponse<UserInfoResponseDTO>> {
    const user = await this.userRepository.findUserWithPerson(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.person) {
      throw new NotFoundException(
        'No se encontraron datos de persona para este usuario',
      );
    }

    const data: UserInfoResponseDTO = {
      id: user.id,
      mail: user.mail,
      username: user.username,
      avatarUrl: user.avatarUrl,
      name: user.person.name,
      lastName: user.person.lastName,
      isVerified: user.person.isVerified,
      role: user.role.name,
    };

    return createApiResponse(data, true);
  }
}
