import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsNumber,
  ValidateNested,
  IsArray,
  MinLength,
} from "class-validator";

export class portfolioImage {
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

export class createPortfolioItemRequestDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: "El número de WhatsApp debe contener solo numeros.",
  })
  whatsappContact: string;

  @IsArray()
  @Type(() => portfolioImage)
  @ValidateNested()
  // At least one image is required
  @MinLength(1)
  images: portfolioImage[];
}
