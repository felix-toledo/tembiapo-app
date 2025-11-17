import { ApiResponse } from "@tembiapo/types";

export interface LogoutResponseDTO{
    message : string
}

export type logoutResponse = ApiResponse<LogoutResponseDTO>