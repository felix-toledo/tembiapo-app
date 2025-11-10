import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async getDbHealth(): Promise<{ total: number }> {
    const total: number = await this.prisma.user.count();
    return { total };
  }
}
