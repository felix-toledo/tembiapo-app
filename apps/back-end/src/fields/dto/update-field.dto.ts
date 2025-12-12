import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateFieldDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
