import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Reciclaje)
    private readonly reciclajeRepository: Repository<Reciclaje>,
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

    const profile = await this.buildProfilePayload(usuario);

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: profile,
    };
  }

  async getProfile(userId: string) {
    const usuario = await this.usuariosService.findById(userId);
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return this.buildProfilePayload(usuario);
  }

  async refreshToken(userId: string) {
    const usuario = await this.usuariosService.findById(userId);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no válido');
    }

    const profile = await this.buildProfilePayload(usuario);

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: profile,
    };
  }

  private async buildProfilePayload(usuario: any) {
    const baseProfile = {
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      debe_cambiar_password: usuario.debe_cambiar_password,
      institucion_id: usuario.institucion_id,
      curso_id: usuario.curso_id,
    };

    if (usuario.rol?.nombre !== 'ESTUDIANTE') {
      return baseProfile;
    }

    const estudiante = await this.estudianteRepository.findOne({
      where: { usuario: { id: usuario.id } },
      relations: ['curso'],
    });

    if (!estudiante) {
      return baseProfile;
    }

    const totalBottlesResult = await this.reciclajeRepository
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.cantidad), 0)', 'total')
      .where('r.estudiante_id = :estudianteId', { estudianteId: estudiante.id })
      .getRawOne<{ total: string | number }>();

    const totalBottles = Number(totalBottlesResult?.total ?? 0);

    return {
      ...baseProfile,
      id: estudiante.id,
      codigo_estudiante: estudiante.codigo_estudiante,
      puntos: estudiante.puntos,
      totalBottles,
      curso: estudiante.curso
        ? {
            id: estudiante.curso.id,
            nombre: estudiante.curso.nombre,
            institucion_id: estudiante.curso.institucion_id,
          }
        : null,
      curso_id: estudiante.curso?.id ?? usuario.curso_id,
      institucion_id: estudiante.curso?.institucion_id ?? usuario.institucion_id,
    };
  }

  async cambiarPasswordPropia(userId: string, passwordActual: string, passwordNueva: string) {
    const usuario = await this.usuariosService.findById(userId);
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordValida = await bcrypt.compare(passwordActual, usuario.password_hash);
    if (!passwordValida) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    usuario.password_hash = await bcrypt.hash(passwordNueva, 10);
    usuario.debe_cambiar_password = false;
    await this.usuariosService.save(usuario);

    return { message: 'Contraseña actualizada correctamente' };
  }
}