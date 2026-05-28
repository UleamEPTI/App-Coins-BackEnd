import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialPuntos, TipoTransaccion } from './entities/historial-puntos.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';

@Injectable()
export class PuntosService {
  constructor(
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async modificarPuntos(dto: ModificarPuntosDto, usuarioId?: string, usuarioEmail?: string, ip?: string) {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
    if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

    const puntosAnteriores = estudiante.puntos;

    if (dto.tipo === TipoTransaccion.RESTA || dto.tipo === TipoTransaccion.CANJE) {
      if (estudiante.puntos < dto.puntos) {
        throw new BadRequestException(`Puntos insuficientes. Tiene ${estudiante.puntos}, necesita ${dto.puntos}`);
      }
      estudiante.puntos -= dto.puntos;
    } else {
      estudiante.puntos += dto.puntos;
    }

    await this.estudianteRepository.save(estudiante);

    const transaccion = this.historialRepository.create({
      estudiante,
      tipo: dto.tipo,
      puntos: dto.puntos,
      descripcion: dto.descripcion,
    });
    await this.historialRepository.save(transaccion);

    // Auditoría
    await this.auditoriaService.registrar({
      tabla: 'historial_puntos',
      accion: AccionAuditoria.CREATE,
      registro_id: transaccion.id,
      datos_anteriores: { puntos: puntosAnteriores },
      datos_nuevos: {
        tipo: dto.tipo,
        puntos: dto.puntos,
        descripcion: dto.descripcion,
        puntos_resultantes: estudiante.puntos,
      },
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    return { estudiante, transaccion };
  }

  async getHistorial(estudiante_id: string): Promise<HistorialPuntos[]> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
    if (!estudiante) throw new NotFoundException(`Estudiante ${estudiante_id} no encontrado`);

    return this.historialRepository.find({
      where: { estudiante: { id: estudiante_id } },
      order: { created_at: 'DESC' },
    });
  }
}