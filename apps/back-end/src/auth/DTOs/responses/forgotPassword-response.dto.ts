import { ApiResponse } from '@tembiapo/types';

export class ForgotPasswordResponseDTO {
  message: string;
}

export class ResetPasswordResponseDTO {
  message: string;
}

export type forgotPasswordResponse = ApiResponse<ForgotPasswordResponseDTO>;
export type resetPasswordResponse = ApiResponse<ResetPasswordResponseDTO>;
