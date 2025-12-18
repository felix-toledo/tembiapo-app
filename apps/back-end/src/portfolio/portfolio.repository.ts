import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PortfolioItem, PortfolioImage, Prisma } from '@tembiapo/db';
import { CreatePortfolioItemRequestDTO } from './dto/create-portfolio-item.request.dto';
import { UpdatePortfolioItemRequestDTO } from './dto/update-portfolio-item.request.dto';
import { AddPortfolioImageRequestDTO } from './dto/add-portfolio-image.request.dto';
import { UpdatePortfolioImageRequestDTO } from './dto/update-portfolio-image.request.dto';

// Type for PortfolioItem with images included
export type PortfolioItemWithImages = Prisma.PortfolioItemGetPayload<{
  include: {
    images: true;
    field: true;
  };
}>;

@Injectable()
export class PortfolioRepository {
  constructor(private prisma: PrismaService) {}

  // ==================== PORTFOLIO ITEM CRUD ====================

  /**
   * Creates a new portfolio item with its images for a professional
   * @param professionalId - ID of the professional
   * @param dto - Data transfer object with portfolio item data
   * @returns The created portfolio item with its images
   */
  async createPortfolioItem(
    professionalId: string,
    dto: CreatePortfolioItemRequestDTO,
  ): Promise<PortfolioItemWithImages> {
    return await this.prisma.portfolioItem.create({
      data: {
        title: dto.title,
        description: dto.description,
        professionalId: professionalId,
        fieldId: dto.fieldId,
        // Create related images
        images: {
          create: (dto.images || []).map((image) => ({
            imageUrl: image.imageUrl,
            description: image.description,
            order: image.order,
          })),
        },
      },
      include: {
        field: true,
        images: {
          where: {
            deletedAt: null, // Only include non-deleted images
          },
          orderBy: {
            order: 'asc', // Order by 'order' field, main image (0) first
          },
        },
      },
    });
  }

  /**
   * Gets a portfolio item by its ID
   * @param id - Portfolio item ID
   * @returns The portfolio item with its images or null if not found
   */
  async getPortfolioItemById(
    id: string,
  ): Promise<PortfolioItemWithImages | null> {
    return await this.prisma.portfolioItem.findFirst({
      where: {
        id,
        deletedAt: null, // Only non-deleted items
      },
      include: {
        field: true,
        images: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  /**
   * Gets all portfolio items for a specific professional
   * @param professionalId - Professional ID
   * @returns Array of portfolio items with their images
   */
  async getAllPortfolioItemsByProfessionalId(
    professionalId: string,
  ): Promise<PortfolioItemWithImages[]> {
    return await this.prisma.portfolioItem.findMany({
      where: {
        professionalId,
        deletedAt: null,
      },
      include: {
        field: true,
        images: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
    });
  }

  /**
   * Gets all portfolio items for a specific professional by username
   * @param username - Professional's username
   * @returns Array of portfolio items with their images
   */
  async getAllPortfolioItemsByUsername(
    username: string,
  ): Promise<PortfolioItemWithImages[]> {
    return await this.prisma.portfolioItem.findMany({
      where: {
        professional: {
          user: {
            username,
          },
        },
        deletedAt: null,
      },
      include: {
        field: true,
        images: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
    });
  }

  /**
   * Updates a portfolio item
   * @param id - Portfolio item ID
   * @param dto - Data to update
   * @returns The updated portfolio item
   */
  async updatePortfolioItem(
    id: string,
    dto: UpdatePortfolioItemRequestDTO,
  ): Promise<PortfolioItem> {
    return await this.prisma.portfolioItem.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Soft deletes a portfolio item (sets deletedAt timestamp)
   * @param id - Portfolio item ID
   * @returns The deleted portfolio item
   */
  async deletePortfolioItem(id: string): Promise<PortfolioItem> {
    return await this.prisma.portfolioItem.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Hard deletes a portfolio item (permanent deletion)
   * @param id - Portfolio item ID
   * @returns The deleted portfolio item
   */
  async hardDeletePortfolioItem(id: string): Promise<PortfolioItem> {
    return await this.prisma.portfolioItem.delete({
      where: { id },
    });
  }

  // ==================== PORTFOLIO IMAGE CRUD ====================

  /**
   * Creates a new portfolio image
   * @param portfolioItemId - Portfolio item ID
   * @param dto - Image data
   * @returns The created image
   */
  async createPortfolioImage(
    portfolioItemId: string,
    dto: AddPortfolioImageRequestDTO,
  ): Promise<PortfolioImage> {
    return await this.prisma.portfolioImage.create({
      data: {
        portfolioItemId,
        imageUrl: dto.imageUrl || '',
        description: dto.description,
        order: dto.order,
      },
    });
  }

  /**
   * Gets a portfolio image by its ID
   * @param id - Image ID
   * @returns The image or null if not found
   */
  async getPortfolioImageById(id: string): Promise<PortfolioImage | null> {
    return await this.prisma.portfolioImage.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * Gets all images for a specific portfolio item
   * @param portfolioItemId - Portfolio item ID
   * @returns Array of images ordered by 'order' field
   */
  async getAllImagesByPortfolioItemId(
    portfolioItemId: string,
  ): Promise<PortfolioImage[]> {
    return await this.prisma.portfolioImage.findMany({
      where: {
        portfolioItemId,
        deletedAt: null,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  /**
   * Gets the main image (order = 0) for a portfolio item
   * @param portfolioItemId - Portfolio item ID
   * @returns The main image or null if not found
   */
  async getMainImageByPortfolioItemId(
    portfolioItemId: string,
  ): Promise<PortfolioImage | null> {
    return await this.prisma.portfolioImage.findFirst({
      where: {
        portfolioItemId,
        order: 0,
        deletedAt: null,
      },
    });
  }

  /**
   * Updates a portfolio image
   * @param id - Image ID
   * @param dto - Data to update
   * @returns The updated image
   */
  async updatePortfolioImage(
    id: string,
    dto: UpdatePortfolioImageRequestDTO,
  ): Promise<PortfolioImage> {
    return await this.prisma.portfolioImage.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Soft deletes a portfolio image (sets deletedAt timestamp)
   * @param id - Image ID
   * @returns The deleted image
   */
  async deletePortfolioImage(id: string): Promise<PortfolioImage> {
    return await this.prisma.portfolioImage.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Hard deletes a portfolio image (permanent deletion)
   * @param id - Image ID
   * @returns The deleted image
   */
  async hardDeletePortfolioImage(id: string): Promise<PortfolioImage> {
    return await this.prisma.portfolioImage.delete({
      where: { id },
    });
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Checks if a portfolio item belongs to a specific professional
   * @param portfolioItemId - Portfolio item ID
   * @param professionalId - Professional ID
   * @returns True if the item belongs to the professional, false otherwise
   */
  async portfolioItemBelongsToProfessional(
    portfolioItemId: string,
    professionalId: string,
  ): Promise<boolean> {
    const item = await this.prisma.portfolioItem.findFirst({
      where: {
        id: portfolioItemId,
        professionalId,
        deletedAt: null,
      },
    });
    return item !== null;
  }

  /**
   * Checks if a professional has a specific field
   * @param professionalId - Professional ID
   * @param fieldId - Field ID
   * @returns True if the professional has the field, false otherwise
   */
  async professionalHasField(
    professionalId: string,
    fieldId: string,
  ): Promise<boolean> {
    const fieldProfessional = await this.prisma.fieldProfessional.findUnique({
      where: {
        professionalId_fieldId: {
          professionalId,
          fieldId,
        },
      },
    });
    return fieldProfessional !== null;
  }

  /**
   * Gets the count of portfolio items for a professional
   * @param professionalId - Professional ID
   * @returns Number of portfolio items
   */
  async getPortfolioItemsCount(professionalId: string): Promise<number> {
    return await this.prisma.portfolioItem.count({
      where: {
        professionalId,
        deletedAt: null,
      },
    });
  }

  /**
   * Gets the count of images for a portfolio item
   * @param portfolioItemId - Portfolio item ID
   * @returns Number of images
   */
  async getPortfolioImagesCount(portfolioItemId: string): Promise<number> {
    return await this.prisma.portfolioImage.count({
      where: {
        portfolioItemId,
        deletedAt: null,
      },
    });
  }
}
