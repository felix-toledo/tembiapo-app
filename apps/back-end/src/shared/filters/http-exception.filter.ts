import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { createApiResponse } from '../utils/api-response.factory';
import { ApiResponse } from '@tembiapo/types';

@Catch(HttpException) /// sirve para atrapar solamente excepciones HTTP
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus(); /// Obtiene el codigo de respuesta HTTP

    /// Obtenemos el mensaje de la excepcion
    const exceptionResponse = exception.getResponse();
    const message: string =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message: string }).message;

    ///usamos nuestro factory para crear la respuesta del error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorResponse: ApiResponse<null> = createApiResponse(null, false, {
      message: Array.isArray(message) ? message.join(', ') : message,
      code: status.toString(),
    });

    ///devolvemos la respuesta formateada
    response.status(status).json(errorResponse);
  }
}
