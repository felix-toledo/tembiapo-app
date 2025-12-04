import { PortfolioImageResponseDTO } from './portfolio-image.response.dto';

export class PortfolioItemResponseDTO {
  id: string;
  title: string;
  description: string | null;
  images: PortfolioImageResponseDTO[];
}
