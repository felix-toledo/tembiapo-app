import { ApiResponse } from "@tembiapo/types"
export class GoogleResponseDTO{
    message : string
    accessToken : string
    refreshToken : string
}

export type googleResponse = ApiResponse<GoogleResponseDTO>