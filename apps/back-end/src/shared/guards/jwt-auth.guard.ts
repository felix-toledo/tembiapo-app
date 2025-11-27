import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
Esto simplemente es un guard para futuras protecciones de rutas que requieran autenticacion con JWT
*/
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
