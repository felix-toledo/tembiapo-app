import { ApiResponse } from '@tembiapo/types';

export class ForgotPasswordResponseDTO {
  message: string;
}

export type forgotPasswordResponse = ApiResponse<ForgotPasswordResponseDTO>;
