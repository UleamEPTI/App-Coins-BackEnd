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

  async canjear(
    dto: CreateCanjeDto,
    usuarioId?: string,
    usuarioEmail?: string,
    // NUEVO: rol e institucion del usuario autenticado, para validar que
    // solo pueda canjear premios para cursos de su propia institución.
    usuarioRol?: string,
    usuarioInstitucionId?: string | null,
    ip?: string,
  ): Promise<Canje> {
    const saved = await this.dataSource.transaction(async (manager) => {
      // Bloqueo de fila: si otra petición está canjeando el mismo curso/premio,
      // esta espera hasta que la primera termine, evitando el race condition.
      // COMENTADO: antes bloqueaba Estudiante.
      // const estudiante = await manager.findOne(Estudiante, {
      //   where: { id: dto.estudiante_id },
      //   lock: { mode: 'pessimistic_write' },
      // });
      // if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

      // NUEVO: se usa createQueryBuilder (no manager.findOne) para poder
      // filtrar por institucion_id directo en SQL sin depender de la
      // propiedad `institucion_id` de la entidad Curso, que está mal
      // tipada (declarada como relación @ManyToOne pero tipada como
      // string) y no se puede leer de forma confiable ya cargada.
      const cursoQuery = manager
        .createQueryBuilder(Curso, 'c')
        .where('c.id = :id', { id: dto.curso_id })
        .setLock('pessimistic_write');

      if (usuarioRol !== 'ADMIN') {
        cursoQuery.andWhere('c.institucion_id = :institucion_id', { institucion_id: usuarioInstitucionId });
      }

      const curso = await cursoQuery.getOne();
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

  async findByCurso(curso_id: string, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<Canje[]> {
    // NUEVO: si no es ADMIN, valida que el curso pertenezca a su institución.
    if (usuarioRol && usuarioRol !== 'ADMIN') {
      const pertenece = await this.dataSource
        .createQueryBuilder(Curso, 'c')
        .where('c.id = :curso_id AND c.institucion_id = :institucion_id', { curso_id, institucion_id: usuarioInstitucionId })
        .getExists();
      if (!pertenece) throw new NotFoundException(`Curso ${curso_id} no encontrado`);
    }

    return this.canjeRepository.find({
      where: { curso: { id: curso_id } },
      relations: ['premio'],
      order: { created_at: 'DESC' },
    });
  }

  async actualizarEstado(id: string, estado: EstadoCanje, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Canje> {
    // FIX: antes esto solo cambiaba el campo `estado`. Si se marcaba un
    // canje como CANCELADO, el curso ya había perdido los puntos y el
    // premio ya había perdido stock (eso pasa en canjear()), y nunca se
    // devolvían — el curso quedaba perjudicado sin razón. Ahora, cuando
    // el nuevo estado es CANCELADO, se revierte todo dentro de una
    // transacción con lock pesimista (mismo patrón que canjear()), y se
    // deja registro en el historial de puntos del reverso.
    const { saved, estadoAnterior } = await this.dataSource.transaction(async (manager) => {
      const canje = await manager.findOne(Canje, {
        where: { id },
        relations: ['curso', 'premio'],
        lock: { mode: 'pessimistic_write' },
      });
      if (!canje) throw new NotFoundException(`Canje ${id} no encontrado`);

      const estadoAnterior = canje.estado;

      if (estado === EstadoCanje.CANCELADO) {
        if (estadoAnterior === EstadoCanje.CANCELADO) {
          throw new BadRequestException('Este canje ya está cancelado');
        }

        const curso = await manager.findOne(Curso, {
          where: { id: canje.curso.id },
          lock: { mode: 'pessimistic_write' },
        });
        if (curso) {
          curso.puntos += canje.puntos_gastados;
          await manager.save(curso);

          await manager.save(
            manager.create(HistorialPuntos, {
              curso,
              tipo: TipoTransaccion.SUMA,
              puntos: canje.puntos_gastados,
              descripcion: `Reverso por cancelación de canje: ${canje.premio?.nombre ?? ''}`,
            }),
          );
        }

        const premio = await manager.findOne(Premio, {
          where: { id: canje.premio.id },
          lock: { mode: 'pessimistic_write' },
        });
        if (premio) {
          premio.stock += 1;
          await manager.save(premio);
        }
      }

      canje.estado = estado;
      const saved = await manager.save(canje);
      return { saved, estadoAnterior };
    });

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