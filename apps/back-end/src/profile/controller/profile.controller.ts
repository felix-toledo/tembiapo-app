import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { updateProfileRequestDTO } from '../DTOs/request/update-profile.request.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/role.guard';
import { Roles } from '../../shared/decorators/role.decorator';
import { ProfileService } from '../services/profile.service';
import { createProfessionalRequestDTO } from '../DTOs/request/create-professional.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

///==============MULTER PARA EL MANEJO DE FILES DE IMAGENES================
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('api/profile')
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
    const userId = req.user.userId;
    return await this.profileService.updateProfile(
      userId,
      updateProfileRequest,
    );
  }

  @Post('professional')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProfessional(
    @Body() createProfesionalRequest: createProfessionalRequestDTO,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return await this.profileService.createProfessionalProfile(
      userId,
      createProfesionalRequest,
    );
  }

@Post('avatar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', {
    // Configuración de almacenamiento local
    storage: diskStorage({
      destination: './uploads/avatars', // Carpeta destino 
      filename: (req, file, cb) => {
        // Generamos un nombre único: id-timestamp.extensión
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    }),
    //  Validamos que sea una imagen
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Solo se permiten archivos de imagen'), false);
      }
      cb(null, true);
    }
  }))
  async updatePicture(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('No se subió ningún archivo');
    }

    const userId = req.user.userId;
    
    // Construimos la URL o el path relativo que guardaremos en la BD
    const avatarUrl = `/uploads/avatars/${file.filename}`; 

    // Llamamos al servicio pasando la URL/Path generada
    return await this.profileService.updatePicture(userId, avatarUrl);
  }

}
