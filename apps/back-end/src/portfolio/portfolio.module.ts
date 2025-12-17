import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PortfolioRepository } from './portfolio.repository';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaService } from '../prisma/prisma.service'; // <--- 4. Importar PrismaService

@Module({
  imports: [AuthModule, CloudinaryModule],
  controllers: [PortfolioController],
  // Agregamos PrismaService aquí porque el Repository lo inyecta
  providers: [PortfolioService, PortfolioRepository, PrismaService],
})
export class PortfolioModule {}
