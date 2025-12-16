/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private _cloudinary: any) {}

  // 1. Subida flexible (Pública o Privada)
  async uploadImage(
    file: Express.Multer.File,
    isPrivate = false,
  ): Promise<UploadApiResponse> {
    const options: UploadApiOptions = {
      folder: isPrivate ? 'tembiapo-verification' : 'tembiapo-users',
      // 'authenticated' bloquea todo acceso público sin firma
      type: isPrivate ? 'authenticated' : 'upload',
    };

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }

  // 2. Generar URL temporal para ver la imagen
  getSignedUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      type: 'authenticated', // Coincide con el tipo de subida
      sign_url: true, // Genera la firma segura
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // Link válido por 1 hora
    });
  }
}
