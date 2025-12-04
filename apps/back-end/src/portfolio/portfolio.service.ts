import { CreatePortfolioItemRequestDTO } from './dto/create-portfolio-item.request.dto';
import { UpdatePortfolioItemRequestDTO } from './dto/update-portfolio-item.request.dto';
import { AddPortfolioImageRequestDTO } from './dto/add-portfolio-image.request.dto';
import { UpdatePortfolioImageRequestDTO } from './dto/update-portfolio-image.request.dto';
import { PortfolioItemResponseDTO } from './dto/portfolio-item.response.dto';
import { PortfolioImageResponseDTO } from './dto/portfolio-image.response.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  PortfolioRepository,
  PortfolioItemWithImages,
} from './portfolio.repository';
import { PortfolioImage } from '@tembiapo/db';

@Injectable()
export class PortfolioService {
  constructor(
    private prisma: PrismaService,
    private portfolioRepository: PortfolioRepository,
  ) {}

  // ==================== PORTFOLIO ITEM ====================

  async createPortfolioItem(
    userId: string,
    dto: CreatePortfolioItemRequestDTO,
  ): Promise<PortfolioItemResponseDTO> {
    const professional = await this.getProfessionalByUserId(userId);
    const item = await this.portfolioRepository.createPortfolioItem(
      professional.id,
      dto,
    );
    return this.mapPortfolioItemToDTO(item);
  }

  async getPortfolioItemsByUsername(
    username: string,
  ): Promise<PortfolioItemResponseDTO[]> {
    const items =
      await this.portfolioRepository.getAllPortfolioItemsByUsername(username);
    return items.map((item) => this.mapPortfolioItemToDTO(item));
  }

  async updatePortfolioItem(
    userId: string,
    itemId: string,
    dto: UpdatePortfolioItemRequestDTO,
  ): Promise<PortfolioItemResponseDTO> {
    const professional = await this.getProfessionalByUserId(userId);
    await this.verifyItemOwnership(itemId, professional.id);

    await this.portfolioRepository.updatePortfolioItem(itemId, dto);
    const updatedItem =
      await this.portfolioRepository.getPortfolioItemById(itemId);
    if (!updatedItem) throw new NotFoundException('Portfolio item not found');

    return this.mapPortfolioItemToDTO(updatedItem);
  }

  async deletePortfolioItem(userId: string, itemId: string): Promise<void> {
    const professional = await this.getProfessionalByUserId(userId);
    await this.verifyItemOwnership(itemId, professional.id);

    await this.portfolioRepository.deletePortfolioItem(itemId);
  }

  // ==================== PORTFOLIO IMAGE ====================

  async addPortfolioImage(
    userId: string,
    itemId: string,
    dto: AddPortfolioImageRequestDTO,
  ): Promise<PortfolioImageResponseDTO> {
    const professional = await this.getProfessionalByUserId(userId);
    await this.verifyItemOwnership(itemId, professional.id);

    const image = await this.portfolioRepository.createPortfolioImage(
      itemId,
      dto,
    );
    return this.mapPortfolioImageToDTO(image);
  }

  async updatePortfolioImage(
    userId: string,
    imageId: string,
    dto: UpdatePortfolioImageRequestDTO,
  ): Promise<PortfolioImageResponseDTO> {
    const professional = await this.getProfessionalByUserId(userId);
    const image = await this.portfolioRepository.getPortfolioImageById(imageId);
    if (!image) throw new NotFoundException('Image not found');

    await this.verifyItemOwnership(image.portfolioItemId, professional.id);

    const updatedImage = await this.portfolioRepository.updatePortfolioImage(
      imageId,
      dto,
    );
    return this.mapPortfolioImageToDTO(updatedImage);
  }

  async deletePortfolioImage(userId: string, imageId: string): Promise<void> {
    const professional = await this.getProfessionalByUserId(userId);
    const image = await this.portfolioRepository.getPortfolioImageById(imageId);
    if (!image) throw new NotFoundException('Image not found');

    await this.verifyItemOwnership(image.portfolioItemId, professional.id);

    await this.portfolioRepository.deletePortfolioImage(imageId);
  }

  // ==================== HELPERS ====================

  private async getProfessionalByUserId(userId: string) {
    const professional = await this.prisma.professional.findUnique({
      where: { userId },
    });
    if (!professional) {
      throw new ForbiddenException('User is not a professional');
    }
    return professional;
  }

  private async verifyItemOwnership(
    itemId: string,
    professionalId: string,
  ): Promise<void> {
    const isOwner =
      await this.portfolioRepository.portfolioItemBelongsToProfessional(
        itemId,
        professionalId,
      );
    if (!isOwner) {
      throw new ForbiddenException(
        'You do not have permission to access this portfolio item',
      );
    }
  }

  private mapPortfolioItemToDTO(
    item: PortfolioItemWithImages,
  ): PortfolioItemResponseDTO {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      images: item.images.map((img) => this.mapPortfolioImageToDTO(img)),
    };
  }

  private mapPortfolioImageToDTO(
    image: PortfolioImage,
  ): PortfolioImageResponseDTO {
    return {
      id: image.id,
      imageUrl: image.imageUrl,
      description: image.description,
      order: image.order,
    };
  }
}
