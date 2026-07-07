import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    TypeOrmModule.forFeature([Estudiante, Reciclaje]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}