import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario = await this.usuariosService.findByEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol.nombre,
      },
    };
  }

  async getProfile(userId: string) {
    const usuario = await this.usuariosService.findById(userId);
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return {
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.rol.nombre,
      activo: usuario.activo,
    };
  }

  async refreshToken(userId: string) {
    const usuario = await this.usuariosService.findById(userId);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no válido');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol.nombre,
      },
    };
  }
}