import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddPortfolioImageRequestDTO {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
