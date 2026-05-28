import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Canje, EstadoCanje } from './entities/canje.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Premio } from '../premios/entities/premio.entity';
import { HistorialPuntos, TipoTransaccion } from '../puntos/entities/historial-puntos.entity';
import { CreateCanjeDto } from './dto/create-canje.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';

@Injectable()
export class CanjesService {
  constructor(
    @InjectRepository(Canje)
    private readonly canjeRepository: Repository<Canje>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Premio)
    private readonly premioRepository: Repository<Premio>,
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async canjear(dto: CreateCanjeDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Canje> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
    if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

    const premio = await this.premioRepository.findOne({ where: { id: dto.premio_id, activo: true } });
    if (!premio) throw new NotFoundException(`Premio ${dto.premio_id} no encontrado o inactivo`);

    if (premio.stock <= 0) throw new BadRequestException('El premio no tiene stock disponible');

    if (estudiante.puntos < premio.costo_puntos) {
      throw new BadRequestException(
        `Puntos insuficientes. Tiene ${estudiante.puntos}, necesita ${premio.costo_puntos}`,
      );
    }

    estudiante.puntos -= premio.costo_puntos;
    premio.stock -= 1;

    await this.estudianteRepository.save(estudiante);
    await this.premioRepository.save(premio);

    const historial = this.historialRepository.create({
      estudiante,
      tipo: TipoTransaccion.CANJE,
      puntos: premio.costo_puntos,
      descripcion: `Canje por premio: ${premio.nombre}`,
    });
    await this.historialRepository.save(historial);

    const canje = this.canjeRepository.create({
      estudiante,
      premio,
      puntos_gastados: premio.costo_puntos,
      estado: EstadoCanje.PENDIENTE,
    });
    const saved = await this.canjeRepository.save(canje);

    // Auditoría
    await this.auditoriaService.registrar({
      tabla: 'canjes',
      accion: AccionAuditoria.CREATE,
      registro_id: saved.id,
      datos_nuevos: {
        estudiante_id: dto.estudiante_id,
        premio: premio.nombre,
        puntos_gastados: premio.costo_puntos,
        estado: EstadoCanje.PENDIENTE,
      },
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    return saved;
  }

  async findAll(): Promise<Canje[]> {
    return this.canjeRepository.find({
      relations: ['estudiante', 'premio'],
      order: { created_at: 'DESC' },
    });
  }

  async findByEstudiante(estudiante_id: string): Promise<Canje[]> {
    return this.canjeRepository.find({
      where: { estudiante: { id: estudiante_id } },
      relations: ['premio'],
      order: { created_at: 'DESC' },
    });
  }

  async actualizarEstado(id: string, estado: EstadoCanje, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Canje> {
    const canje = await this.canjeRepository.findOne({ where: { id }, relations: ['estudiante', 'premio'] });
    if (!canje) throw new NotFoundException(`Canje ${id} no encontrado`);

    const estadoAnterior = canje.estado;
    canje.estado = estado;
    const saved = await this.canjeRepository.save(canje);

    // Auditoría
    await this.auditoriaService.registrar({
      tabla: 'canjes',
      accion: AccionAuditoria.UPDATE,
      registro_id: id,
      datos_anteriores: { estado: estadoAnterior },
      datos_nuevos: { estado },
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    return saved;
  }
}