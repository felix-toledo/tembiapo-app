import { Module } from '@nestjs/common';
import { ServiceAreaService } from './service-area.service';
import { ServiceAreaController } from './service-area.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ServiceAreaController],
  providers: [ServiceAreaService],
})
export class ServiceAreaModule {}
