import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceAreaDto } from './create-service-area.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateServiceAreaDto extends PartialType(CreateServiceAreaDto) {}
