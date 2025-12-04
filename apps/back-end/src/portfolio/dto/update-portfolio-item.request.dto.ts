import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePortfolioItemRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
