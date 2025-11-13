import { ApiResponse } from '@tembiapo/types';

export class LoginResponseDTO {
  message: string;
  accessToken: string;
}

export type loginResponse = ApiResponse<LoginResponseDTO>;
