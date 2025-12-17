import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  IsArray,
  IsOptional,
  // ArrayMinSize,
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

  @IsString()
  @IsNotEmpty()
  fieldId: string;

  @IsOptional()
  @IsArray()
  @Type(() => PortfolioImageDTO)
  @ValidateNested({ each: true })
  // At least one image is required
  // @ArrayMinSize(1)
  images?: PortfolioImageDTO[];
}
