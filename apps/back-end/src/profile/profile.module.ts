import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './services/profile.service';
import { professionalRepository } from './repository/professional.repository';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService, professionalRepository],
})
export class ProfileModule {}
