import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AddPortfolioImageRequestDTO {
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description: string;

  @Type(() => Number)
  @IsNumber()
  order: number;
}
