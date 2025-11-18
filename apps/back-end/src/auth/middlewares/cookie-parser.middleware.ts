import { Injectable, NestMiddleware } from "@nestjs/common";
import cookieParser from 'cookie-parser'

@Injectable()
export class CookieParserMiddleware implements NestMiddleware{ ///creamos un middleware para parsear las cookies que vienen
    use(req: any, res: any, next: () => void) { /// usamos el metodo use para usar la request y response con type any para manejo global
        cookieParser()(req,res, next) /// usamos el cookieParser para la request y response y las subsiguientes con next
    }
}