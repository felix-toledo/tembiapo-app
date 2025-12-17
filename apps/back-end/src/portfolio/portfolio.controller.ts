/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { ApiTags } from '@nestjs/swagger';

import { CreatePortfolioItemRequestDTO } from './dto/create-portfolio-item.request.dto';
import { UpdatePortfolioItemRequestDTO } from './dto/update-portfolio-item.request.dto';
import { AddPortfolioImageRequestDTO } from './dto/add-portfolio-image.request.dto';
import { UpdatePortfolioImageRequestDTO } from './dto/update-portfolio-image.request.dto';
import { PortfolioItemResponseDTO } from './dto/portfolio-item.response.dto';
import { PortfolioImageResponseDTO } from './dto/portfolio-image.response.dto';

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PortfolioService } from './portfolio.service';
import { API_PREFIX } from '../app.controller';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

@ApiTags('Portfolio')
@Controller(`${API_PREFIX}/portfolio`)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':username')
  async getPortfolioItemsByUsername(
    @Param('username') username: string,
  ): Promise<PortfolioItemResponseDTO[]> {
    return this.portfolioService.getPortfolioItemsByUsername(username);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPortfolioItem(
    @Req() req: any,
    @Body() dto: CreatePortfolioItemRequestDTO,
  ): Promise<PortfolioItemResponseDTO> {
    return this.portfolioService.createPortfolioItem(req.user.userId, dto);
  }

  @Post(':itemId/image')
  @UseGuards(JwtAuthGuard)
  // 1. Interceptamos el archivo con nombre 'file' (el que pusimos en el FormData del front)
  @UseInterceptors(FileInterceptor('file'))
  // 2. Activamos la transformación para que "0" (string) se vuelva 0 (numero)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async addPortfolioImage(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body() dto: AddPortfolioImageRequestDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PortfolioImageResponseDTO> {
    if (file) {
      dto.imageUrl = file.filename || file.originalname;
    }

    return this.portfolioService.addPortfolioImage(
      req.user.userId,
      itemId,
      dto,
      file,
    );
  }
  // ==========================================

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard)
  async deletePortfolioItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.portfolioService.deletePortfolioItem(req.user.userId, itemId);
  }

  @Delete('image/:imageId')
  @UseGuards(JwtAuthGuard)
  async deletePortfolioImage(
    @Req() req: any,
    @Param('imageId') imageId: string,
  ): Promise<void> {
    return this.portfolioService.deletePortfolioImage(req.user.userId, imageId);
  }

  @Patch(':itemId')
  @UseGuards(JwtAuthGuard)
  async updatePortfolioItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdatePortfolioItemRequestDTO,
  ): Promise<PortfolioItemResponseDTO> {
    return this.portfolioService.updatePortfolioItem(
      req.user.userId,
      itemId,
      dto,
    );
  }

  @Patch('image/:imageId')
  @UseGuards(JwtAuthGuard)
  async updatePortfolioImage(
    @Req() req: any,
    @Param('imageId') imageId: string,
    @Body() dto: UpdatePortfolioImageRequestDTO,
  ): Promise<PortfolioImageResponseDTO> {
    return this.portfolioService.updatePortfolioImage(
      req.user.userId,
      imageId,
      dto,
    );
  }
}
