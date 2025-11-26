import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Person } from '@tembiapo/db';
import { last } from 'rxjs';

@Injectable()
export class PersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  /// Método para buscar por DNI
  async findByDni(dni: string): Promise<Person | null> {
    return await this.prisma.person.findUnique({
      where: { dni },
    });
  }

  /// Método para buscar por ID
  async findById(id: string): Promise<Person | null> {
    return await this.prisma.person.findUnique({
      where: { id },
    });
  }

  /// Método para traer todas las personas verificadas
  async getAllPersonVerified(): Promise<Person[]> {
    return await this.prisma.person.findMany({
      where: { isVerified: true },
    });
  }

  //// Método para cargar una persona a la DB
  async createPerson(name: string,lastName: string,dni: string): Promise<Person> {
    return await this.prisma.person.create({
      data: {
        name: name,
        lastName: lastName,
        dni: dni,
      }
    });
  }

  /// Método de verificación de unicidad del DNI
  async isDniExists(dni: string): Promise<boolean> {
    const person = await this.prisma.person.findUnique({
      where: { dni },
      select: { id: true },
    });
    return !!person;
  }

  ///METODOS ADICIONALES

  /// Verificar persona
  async verifyPerson(id: string): Promise<Person> {
    return await this.prisma.person.update({
      where: { id },
      data: {
        isVerified: true,
      },
    });
  }

  /// Buscar persona con usuario relacionado
  async findPersonWithUser(id: string): Promise<Person | null> {
    return await this.prisma.person.findUnique({
      where: { id },
      include: {
        user: true,
        verification: true,
      },
    });
  }

  /// Actualizar datos de persona
  async updatePerson(
    id: string,
    data: {
      name?: string;
      lastName?: string; 
      contactPhone?: string; 
    },
  ): Promise<Person> {
    return await this.prisma.person.update({
      where: { id },
      data,
    });
  }
}
