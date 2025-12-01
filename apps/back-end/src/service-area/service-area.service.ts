import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceAreaDto } from './dto/create-service-area.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';

interface PrismaError {
  code: string;
}

@Injectable()
export class ServiceAreaService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceAreaDto: CreateServiceAreaDto) {
    try {
      return await this.prisma.serviceArea.create({
        data: createServiceAreaDto,
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new ConflictException(
          'Service area with this city, province, and country already exists',
        );
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.serviceArea.findMany();
  }

  async findOne(id: string) {
    const serviceArea = await this.prisma.serviceArea.findUnique({
      where: { id },
    });
    if (!serviceArea) {
      throw new NotFoundException(`Service area with ID ${id} not found`);
    }
    return serviceArea;
  }

  async update(id: string, updateServiceAreaDto: UpdateServiceAreaDto) {
    try {
      return await this.prisma.serviceArea.update({
        where: { id },
        data: updateServiceAreaDto,
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new NotFoundException(`Service area with ID ${id} not found`);
      }
      if (prismaError.code === 'P2002') {
        throw new ConflictException(
          'Service area with this city, province, and country already exists',
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.serviceArea.delete({
        where: { id },
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new NotFoundException(`Service area with ID ${id} not found`);
      }
      throw error;
    }
  }
}
