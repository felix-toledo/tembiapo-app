import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PortfolioRepository } from './portfolio.repository';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaService } from '../prisma/prisma.service'; // <--- 4. Importar PrismaService

@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
    // ============================================================
    // CONFIGURACIÓN DE MULTER (Para guardar archivos con nombre real)
    // ============================================================
    MulterModule.register({
      storage: diskStorage({
        // Carpeta destino: se creará en la raíz de apps/back-end/uploads
        destination: './uploads',
        // Función para nombrar el archivo
        filename: (req, file, callback) => {
          // Opción A: Guardar con el nombre original exacto (mesa.jpg)
          // Esto soluciona tu problema actual de 404.
          // Cuidado: Si subes dos "mesa.jpg", la segunda sobrescribe a la primera.
          const filename = file.originalname;
          /* // Opción B (Más segura para el futuro): Nombre único + extensión
          // Si usas esto, asegúrate que tu Controller use file.filename para guardar en DB
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          */

          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [PortfolioController],
  // Agregamos PrismaService aquí porque el Repository lo inyecta
  providers: [PortfolioService, PortfolioRepository, PrismaService],
})
export class PortfolioModule {}
