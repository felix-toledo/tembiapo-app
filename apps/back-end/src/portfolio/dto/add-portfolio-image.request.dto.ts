import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddPortfolioImageRequestDTO {
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
