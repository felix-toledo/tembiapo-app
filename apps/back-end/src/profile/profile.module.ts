import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './services/profile.service';
import { professionalRepository } from './repository/professional.repository';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, professionalRepository],
})
export class ProfileModule {}