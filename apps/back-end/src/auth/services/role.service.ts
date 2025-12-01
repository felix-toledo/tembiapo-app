import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {} /// inyectamos el servicio de prisma para poder hacer consultas a la tabla role

  //creamos una funcion para buscar el role por nombre
  async findByName(name: string) {
    ///vamos a hacer una consulta findUnique con el servicio de prisma en la tabla role para buscar el rol por nombre y guardarlo en la const role
    const role = await this.prisma.role.findUnique({
      where: { name }, /// el where hace referencia explicita al where de la consulta en la DB , es decir, select * from role where = 'name'
    });

    ///si la variable esta vacia (o undefinded o null) devolvemos una excepcion not found para el rol
    if (!role) {
      throw new NotFoundException(`Role ${name} not found`);
    }
    /// si se encuentra, retornamos el rol
    return role;
  }


  async findById(id : string){
    const role = await this.prisma.role.findFirst({
      where: {id}
    });

    if(!role){
      throw new NotFoundException(`El rol con ID ${id} no existe`)
    }
    return role
  }
}
