import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // FIX: antes había un fallback `?? 'secret'` — si en el servidor de
    // producción faltaba la variable de entorno JWT_SECRET, la app
    // arrancaba igual firmando/validando tokens con la palabra literal
    // "secret", que cualquiera podría adivinar y forjar un token de
    // ADMIN válido. Ahora, si falta, la app falla al arrancar (mejor
    // fallar rápido y visible que arrancar insegura en silencio).
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_SECRET no está configurado. Define esta variable de entorno antes de arrancar el servidor (revisa el archivo .env).',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
      // NUEVO: institucion_id viaja en el token y queda disponible en
      // req.user para que los services validen pertenencia a institución.
      institucion_id: payload.institucion_id ?? null,
    };
  }
}