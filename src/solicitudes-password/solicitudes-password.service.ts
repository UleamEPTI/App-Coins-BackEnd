import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SolicitudPassword, EstadoSolicitud } from './entities/solicitud-password.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { AtenderSolicitudDto } from './dto/atender-solicitud.dto';

const CAMPOS_USUARIO_SEGUROS = [
  'id', 'nombres', 'apellidos', 'cedula', 'telefono', 'email',
  'foto_perfil', 'institucion_id', 'curso_id', 'activo', 'materia',
  'created_at', 'updated_at',
] as const;

@Injectable()
export class SolicitudesPasswordService {
  constructor(
    @InjectRepository(SolicitudPassword)
    private readonly solicitudRepository: Repository<SolicitudPassword>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // INSTITUCION cambia contraseña directamente
  async cambiarPasswordDirecto(usuarioObjetivoId: string, nuevaPassword: string, solicitanteId: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioObjetivoId },
      relations: ['rol'],
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const hash = await bcrypt.hash(nuevaPassword, 10);
    usuario.password_hash = hash;
    await this.usuarioRepository.save(usuario);

    return { message: `Contraseña de ${usuario.nombres} ${usuario.apellidos} actualizada correctamente` };
  }

  // INSTITUCION crea solicitud al ADMIN
  async crearSolicitud(dto: CreateSolicitudDto, solicitanteId: string): Promise<SolicitudPassword> {
    const solicitante = await this.usuarioRepository.findOne({ where: { id: solicitanteId } });
    if (!solicitante) throw new NotFoundException('Solicitante no encontrado');

    const objetivo = await this.usuarioRepository.findOne({ where: { id: dto.usuario_objetivo_id } });
    if (!objetivo) throw new NotFoundException('Usuario objetivo no encontrado');

    const solicitud = this.solicitudRepository.create({
      solicitado_por: solicitante,
      usuario_objetivo: objetivo,
      mensaje: dto.mensaje,
      estado: EstadoSolicitud.PENDIENTE,
    });

    const saved = await this.solicitudRepository.save(solicitud);
    return this.limpiarSolicitud(saved);
  }

  // ADMIN ve todas las solicitudes pendientes
  async findPendientes(): Promise<SolicitudPassword[]> {
    const solicitudes = await this.solicitudRepository.find({
      where: { estado: EstadoSolicitud.PENDIENTE },
      relations: ['solicitado_por', 'usuario_objetivo'],
      order: { created_at: 'DESC' },
    });
    return solicitudes.map(s => this.limpiarSolicitud(s));
  }

  async findAll(): Promise<SolicitudPassword[]> {
    const solicitudes = await this.solicitudRepository.find({
      relations: ['solicitado_por', 'usuario_objetivo'],
      order: { created_at: 'DESC' },
    });
    return solicitudes.map(s => this.limpiarSolicitud(s));
  }

  // ADMIN atiende la solicitud y cambia la contraseña
  async atenderSolicitud(id: string, dto: AtenderSolicitudDto): Promise<{ solicitud: SolicitudPassword; message: string }> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id },
      relations: ['usuario_objetivo'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      throw new ForbiddenException('Esta solicitud ya fue atendida');
    }

    if (dto.estado === EstadoSolicitud.ATENDIDA) {
      const hash = await bcrypt.hash(dto.nueva_password, 10);
      solicitud.usuario_objetivo.password_hash = hash;
      await this.usuarioRepository.save(solicitud.usuario_objetivo);
    }

    solicitud.estado = dto.estado;
    if (dto.mensaje) solicitud.mensaje = dto.mensaje;
    const saved = await this.solicitudRepository.save(solicitud);

    return {
      solicitud: this.limpiarSolicitud(saved),
      message: dto.estado === EstadoSolicitud.ATENDIDA
        ? 'Contraseña cambiada exitosamente'
        : 'Solicitud rechazada',
    };
  }

  // Elimina password_hash de las relaciones antes de devolver la respuesta
  private limpiarSolicitud(solicitud: SolicitudPassword): SolicitudPassword {
    const limpia = { ...solicitud } as any;

    if (limpia.solicitado_por) {
      const { password_hash, ...resto } = limpia.solicitado_por;
      limpia.solicitado_por = resto;
    }
    if (limpia.usuario_objetivo) {
      const { password_hash, ...resto } = limpia.usuario_objetivo;
      limpia.usuario_objetivo = resto;
    }

    return limpia;
  }
} 