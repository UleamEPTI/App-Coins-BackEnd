import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SolicitudPassword, EstadoSolicitud } from './entities/solicitud-password.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { AtenderSolicitudDto } from './dto/atender-solicitud.dto';

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

    return this.solicitudRepository.save(solicitud);
  }

  // ADMIN ve todas las solicitudes pendientes
  async findPendientes(): Promise<SolicitudPassword[]> {
    return this.solicitudRepository.find({
      where: { estado: EstadoSolicitud.PENDIENTE },
      relations: ['solicitado_por', 'usuario_objetivo'],
      order: { created_at: 'DESC' },
    });
  }

  async findAll(): Promise<SolicitudPassword[]> {
    return this.solicitudRepository.find({
      relations: ['solicitado_por', 'usuario_objetivo'],
      order: { created_at: 'DESC' },
    });
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
    await this.solicitudRepository.save(solicitud);

    return {
      solicitud,
      message: dto.estado === EstadoSolicitud.ATENDIDA
        ? 'Contraseña cambiada exitosamente'
        : 'Solicitud rechazada',
    };
  }
}