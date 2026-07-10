import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Canje, EstadoCanje } from './entities/canje.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Premio } from '../premios/entities/premio.entity';
import { HistorialPuntos, TipoTransaccion } from '../puntos/entities/historial-puntos.entity';
import { CreateCanjeDto } from './dto/create-canje.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';
// COMENTADO: antes usaba Estudiante, ahora usa Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';

@Injectable()
export class CanjesService {
  constructor(
    @InjectRepository(Canje)
    private readonly canjeRepository: Repository<Canje>,
    // COMENTADO: antes inyectaba Estudiante.
    // @InjectRepository(Estudiante)
    // private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Premio)
    private readonly premioRepository: Repository<Premio>,
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
    private readonly auditoriaService: AuditoriaService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async canjear(dto: CreateCanjeDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Canje> {
    const saved = await this.dataSource.transaction(async (manager) => {
      // Bloqueo de fila: si otra petición está canjeando el mismo curso/premio,
      // esta espera hasta que la primera termine, evitando el race condition.
      // COMENTADO: antes bloqueaba Estudiante.
      // const estudiante = await manager.findOne(Estudiante, {
      //   where: { id: dto.estudiante_id },
      //   lock: { mode: 'pessimistic_write' },
      // });
      // if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

      const curso = await manager.findOne(Curso, {
        where: { id: dto.curso_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!curso) throw new NotFoundException(`Curso ${dto.curso_id} no encontrado`);

      const premio = await manager.findOne(Premio, {
        where: { id: dto.premio_id, activo: true },
        lock: { mode: 'pessimistic_write' },
      });
      if (!premio) throw new NotFoundException(`Premio ${dto.premio_id} no encontrado o inactivo`);

      if (premio.stock <= 0) throw new BadRequestException('El premio no tiene stock disponible');

      // COMENTADO: antes validaba contra estudiante.puntos.
      // if (estudiante.puntos < premio.costo_puntos) {
      //   throw new BadRequestException(
      //     `Puntos insuficientes. Tiene ${estudiante.puntos}, necesita ${premio.costo_puntos}`,
      //   );
      // }
      if (curso.puntos < premio.costo_puntos) {
        throw new BadRequestException(
          `Puntos insuficientes. Tiene ${curso.puntos}, necesita ${premio.costo_puntos}`,
        );
      }

      // COMENTADO: estudiante.puntos -= premio.costo_puntos;
      curso.puntos -= premio.costo_puntos;
      premio.stock -= 1;

      // COMENTADO: await manager.save(estudiante);
      await manager.save(curso);
      await manager.save(premio);

      const historial = manager.create(HistorialPuntos, {
        // COMENTADO: estudiante,
        curso,
        tipo: TipoTransaccion.CANJE,
        puntos: premio.costo_puntos,
        descripcion: `Canje por premio: ${premio.nombre}`,
      });
      await manager.save(historial);

      const canje = manager.create(Canje, {
        // COMENTADO: estudiante,
        curso,
        premio,
        puntos_gastados: premio.costo_puntos,
        estado: EstadoCanje.PENDIENTE,
      });
      const savedCanje = await manager.save(canje);

      return { savedCanje, premioNombre: premio.nombre };
    });

    // Auditoría fuera de la transacción crítica
    try {
      await this.auditoriaService.registrar({
        tabla: 'canjes',
        accion: AccionAuditoria.CREATE,
        registro_id: saved.savedCanje.id,
        datos_nuevos: {
          // COMENTADO: estudiante_id: dto.estudiante_id,
          curso_id: dto.curso_id,
          premio: saved.premioNombre,
          puntos_gastados: saved.savedCanje.puntos_gastados,
          estado: EstadoCanje.PENDIENTE,
        },
        usuario_id: usuarioId,
        usuario_email: usuarioEmail,
        ip,
      });
    } catch (err) {
      console.error('Error al registrar auditoría:', err);
    }

    return saved.savedCanje;
  }

  async findAll(): Promise<Canje[]> {
    return this.canjeRepository.find({
      // COMENTADO: relations: ['estudiante', 'premio'],
      relations: ['curso', 'premio'],
      order: { created_at: 'DESC' },
    });
  }

  // COMENTADO: ya no existe estudiante individual, reemplazado por findByCurso.
  // async findByEstudiante(estudiante_id: string): Promise<Canje[]> {
  //   return this.canjeRepository.find({
  //     where: { estudiante: { id: estudiante_id } },
  //     relations: ['premio'],
  //     order: { created_at: 'DESC' },
  //   });
  // }

  async findByCurso(curso_id: string): Promise<Canje[]> {
    return this.canjeRepository.find({
      where: { curso: { id: curso_id } },
      relations: ['premio'],
      order: { created_at: 'DESC' },
    });
  }

  async actualizarEstado(id: string, estado: EstadoCanje, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Canje> {
    const canje = await this.canjeRepository.findOne({
      where: { id },
      // COMENTADO: relations: ['estudiante', 'premio'],
      relations: ['curso', 'premio'],
    });
    if (!canje) throw new NotFoundException(`Canje ${id} no encontrado`);

    const estadoAnterior = canje.estado;
    canje.estado = estado;
    const saved = await this.canjeRepository.save(canje);

    try {
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
    } catch (err) {
      console.error('Error al registrar auditoría:', err);
    }

    return saved;
  }
}