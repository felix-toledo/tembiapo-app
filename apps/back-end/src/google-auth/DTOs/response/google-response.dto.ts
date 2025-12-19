import { ApiResponse } from '@tembiapo/types';
export class GoogleResponseDTO {
  message: string;
  accessToken: string;
  refreshToken: string;
  requiresProfileCompletion?: boolean;
  requiresUsername?: boolean;
}

export type googleResponse = ApiResponse<GoogleResponseDTO>;
