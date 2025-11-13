import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt"
import { ConfigService } from "@nestjs/config";

/*
Esta clase nos sirve para validar el payload que le llega, es decir, un token, aca aplicamos el patron de diseño strategy para 
crear algoritmos de validacion intercambiables en tiempo de ejecucion
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){ ///Esta clase va a extender (heredar) de PassportStrategy y le pasamos por parametro el patron
    constructor( configService : ConfigService){  /// inyectamos por constructor el configService para traer nuestra firma de los JWT
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ///Extraemos el JWT de la request con la clase ExtractJwt y obtenemos el JWT del header de la request
            ignoreExpiration: false, ///Aca no ignoramos el expiration ya que nos sirve para saber si el token ya expiro
            secretOrKey: configService.get<string>('SIGNED_JWT') ///Aca obtenemos la firma de nuestro JWT
        });
    }

    async validate(payload : any){ ///Validamos el payload del JWT
        return {userId: payload.sub, email: payload.mail} ///Devolvemos los datos que queremos que esten en req.user
    }
}