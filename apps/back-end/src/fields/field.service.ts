import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

interface PrismaError {
  code: string;
}

@Injectable()
export class FieldService {
  constructor(private prisma: PrismaService) {}

  async create(createFieldDto: CreateFieldDto) {
    try {
      return await this.prisma.field.create({
        data: createFieldDto,
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new ConflictException('Field with this name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.field.findMany();
  }

  async findOne(id: string) {
    const field = await this.prisma.field.findUnique({
      where: { id },
    });
    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }
    return field;
  }

  async update(id: string, updateFieldDto: UpdateFieldDto) {
    try {
      return await this.prisma.field.update({
        where: { id },
        data: updateFieldDto,
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new NotFoundException(`Field with ID ${id} not found`);
      }
      if (prismaError.code === 'P2002') {
        throw new ConflictException('Field with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.field.delete({
        where: { id },
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new NotFoundException(`Field with ID ${id} not found`);
      }
      throw error;
    }
  }
}
