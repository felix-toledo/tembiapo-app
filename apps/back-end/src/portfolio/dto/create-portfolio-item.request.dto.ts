import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  IsArray,
  MinLength,
} from 'class-validator';

export class PortfolioImageDTO {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  order: number; // 0 is for main Image
}

export class CreatePortfolioItemRequestDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @Type(() => PortfolioImageDTO)
  @ValidateNested()
  // At least one image is required
  @MinLength(1)
  images: PortfolioImageDTO[];
}
