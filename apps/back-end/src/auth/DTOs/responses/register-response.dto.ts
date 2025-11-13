/// Response para el data : <T> del ApiResponse
import { ApiResponse } from '@tembiapo/types';

export interface RegisterResponseData {
  message : string /// el mensaje que va a devolver el response (el success lo ponemos de forma explicita en el codigo)
}



/*
exporto como registerResponse un type para el ApiResponse que va a devolver
 un RegisterResponseData(en el service se lo llama como RegisterResponse)
*/
export type RegisterResponse = ApiResponse<RegisterResponseData>; 
