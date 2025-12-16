import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { VerificationResponseDto } from './dto/verification.response.dto';
import { VerificationStatus } from '@tembiapo/db';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly httpService: HttpService,
  ) {}

  async create(
    userId: string,
    files: { dni?: Express.Multer.File[]; selfie?: Express.Multer.File[] },
  ) {
    if (!files || !files.dni || !files.selfie) {
      throw new BadRequestException(
        'Lack of files: dni and selfie are required',
      );
    }

    const dniFile = files.dni[0];
    const selfieFile = files.selfie[0];

    // 1. Check if user exists and is a professional
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        person: true,
        professional: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!user.professional) {
      throw new ForbiddenException('User is not a professional');
    }

    if (user.person.isVerified) {
      throw new BadRequestException('Person is already verified');
    }

    // 2. Upload images to Cloudinary
    let dniUploadResult: UploadApiResponse;
    let selfieUploadResult: UploadApiResponse;
    try {
      const results = await Promise.all([
        this.cloudinary.uploadImage(dniFile, true), // isPrivate = true
        this.cloudinary.uploadImage(selfieFile, true), // isPrivate = true
      ]);
      dniUploadResult = results[0];
      selfieUploadResult = results[1];
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new InternalServerErrorException('Error uploading images');
    }

    // 3. Call external API
    let externalVerificationRef: VerificationResponseDto;

    try {
      // Generate signed URLs for the external service to access the private images
      const dniSignedUrl = this.cloudinary.getSignedUrl(
        dniUploadResult.public_id,
      );
      const selfieSignedUrl = this.cloudinary.getSignedUrl(
        selfieUploadResult.public_id,
      );

      const payload = {
        image1_url: dniSignedUrl,
        image2_url: selfieSignedUrl,
      };

      console.log('Sending verification request with URLs:', payload);

      const { data } = await lastValueFrom(
        this.httpService.post<VerificationResponseDto>(
          'http://192.241.183.41:5000/verify-faces',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      externalVerificationRef = data;
      console.log('External verification response:', externalVerificationRef);
    } catch (error) {
      console.error('External verification API error:', error);
      throw new InternalServerErrorException(
        'Error contacting verification service',
      );
    }

    // 4. Create Verification record
    // The previous implementation used 'match' (boolean) directly.
    // Ensure the external API response matches VerificationResponseDto interface
    const status = externalVerificationRef.match
      ? VerificationStatus.ok
      : VerificationStatus.rejected;

    const verification = await this.prisma.verification.create({
      data: {
        personId: user.personId,
        frontDniPictureUrl: dniUploadResult.secure_url, // Store the permanent secure URL
        verifiedPictureUrl: selfieUploadResult.secure_url,
        status: status,
      },
    });

    if (externalVerificationRef.match) {
      await this.prisma.person.update({
        where: { id: user.personId },
        data: { isVerified: true },
      });
    }

    return {
      success: externalVerificationRef.success,
      match: externalVerificationRef.match,
      confidence: externalVerificationRef.confidence,
      verificationId: verification.id,
    };
  }

  async getVerificationStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        person: {
          include: {
            verification: true,
          },
        },
      },
    });

    if (!user || !user.person) {
      throw new ForbiddenException('User or person not found');
    }

    return user.person.verification;
  }
}
