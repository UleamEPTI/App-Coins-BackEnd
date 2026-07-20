import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtStrategy } from './strategies/jwt.strategy';
// COMENTADO: ya no se usan en AuthService (perfil individual de estudiante
// desactivado). Ver auth.service.ts.
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';
// import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    // COMENTADO: TypeOrmModule.forFeature([Estudiante, Reciclaje]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // FIX: mismo problema que en jwt.strategy.ts — se quita el
        // fallback `?? 'secret'` para no firmar tokens con un secreto
        // adivinable si falta la variable de entorno.
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error(
            'JWT_SECRET no está configurado. Define esta variable de entorno antes de arrancar el servidor (revisa el archivo .env).',
          );
        }
        return {
          secret,
          signOptions: { expiresIn: '24h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}