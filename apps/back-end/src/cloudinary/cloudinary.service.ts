/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */

import { Injectable, Inject } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import sharp from 'sharp';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private _cloudinary: any) {}

  /**
   * Optimizes an image buffer using sharp
   * - Resizes to max 1920px (maintaining aspect ratio)
   * - Converts to JPEG with 85% quality
   * - Only processes actual image files
   */
  private async optimizeImage(buffer: Buffer): Promise<Buffer> {
    try {
      // Try to process as image
      const metadata = await sharp(buffer).metadata();

      // Only optimize if it's an actual image
      if (!metadata.format) {
        return buffer;
      }

      console.log(
        `🖼️ Optimizing image: ${metadata.format} ${metadata.width}x${metadata.height}`,
      );

      const optimized = await sharp(buffer)
        .resize(1920, 1920, {
          fit: 'inside', // Maintain aspect ratio, don't upscale
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      console.log(`✅ Optimized: ${buffer.length} → ${optimized.length} bytes`);

      return optimized;
    } catch {
      // Not an image or optimization failed, return original
      console.log('⚠️ Could not optimize, using original file');
      return buffer;
    }
  }

  // 1. Subida flexible (Pública o Privada)
  async uploadImage(
    file: Express.Multer.File,
    isPrivate = false,
  ): Promise<UploadApiResponse> {
    // Optimize the image before uploading
    const optimizedBuffer = await this.optimizeImage(file.buffer);

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
      Readable.from(optimizedBuffer).pipe(upload);
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
