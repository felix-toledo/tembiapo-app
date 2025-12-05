import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdatePortfolioImageRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  order?: number;
}
