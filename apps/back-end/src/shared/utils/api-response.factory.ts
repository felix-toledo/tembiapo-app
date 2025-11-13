import { ApiResponse } from "@tembiapo/types";
///PATRON FACTORY FUNCTION PARA LA CREACION DE RESPONSES DE FORMA CONSTANTE PARA LA API
export function createApiResponse<T>(data: T, success = true, error?: {message: string; code?: string}):ApiResponse<T>{
    return{
        success,
        data: success ? data : null,
        error: success ? undefined : error,
    };
}