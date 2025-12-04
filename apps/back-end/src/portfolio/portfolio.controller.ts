/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

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
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { API_PREFIX } from '../app.controller';
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
  async createPortfolioItem(
    @Req() req: any,
    @Body() dto: CreatePortfolioItemRequestDTO,
  ): Promise<PortfolioItemResponseDTO> {
    // Assuming req.user.id is populated by some auth middleware/guard
    return this.portfolioService.createPortfolioItem(req.user.id, dto);
  }

  @Post(':itemId/image')
  async addPortfolioImage(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body() dto: AddPortfolioImageRequestDTO,
  ): Promise<PortfolioImageResponseDTO> {
    return this.portfolioService.addPortfolioImage(req.user.id, itemId, dto);
  }

  @Delete(':itemId')
  async deletePortfolioItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.portfolioService.deletePortfolioItem(req.user.id, itemId);
  }

  @Delete('image/:imageId')
  async deletePortfolioImage(
    @Req() req: any,
    @Param('imageId') imageId: string,
  ): Promise<void> {
    return this.portfolioService.deletePortfolioImage(req.user.id, imageId);
  }

  @Patch(':itemId')
  async updatePortfolioItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdatePortfolioItemRequestDTO,
  ): Promise<PortfolioItemResponseDTO> {
    return this.portfolioService.updatePortfolioItem(req.user.id, itemId, dto);
  }

  @Patch('image/:imageId')
  async updatePortfolioImage(
    @Req() req: any,
    @Param('imageId') imageId: string,
    @Body() dto: UpdatePortfolioImageRequestDTO,
  ): Promise<PortfolioImageResponseDTO> {
    return this.portfolioService.updatePortfolioImage(
      req.user.id,
      imageId,
      dto,
    );
  }
}
