import { ApiResponse } from "@tembiapo/types";

export class LogoutResponseDTO{
    message : string
}

export type logoutResponse = ApiResponse<LogoutResponseDTO>