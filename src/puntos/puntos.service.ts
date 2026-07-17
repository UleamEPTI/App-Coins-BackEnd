import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HistorialPuntos, TipoTransaccion } from './entities/historial-puntos.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';
// COMENTADO: antes usaba Estudiante, ahora usa Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';

@Injectable()
export class PuntosService {
  constructor(
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
    // COMENTADO: antes inyectaba Estudiante.
    // @InjectRepository(Estudiante)
    // private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    private readonly auditoriaService: AuditoriaService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async modificarPuntos(
    dto: ModificarPuntosDto,
    usuarioId?: string,
    usuarioEmail?: string,
    // NUEVO: rol e institucion del usuario autenticado, para validar que
    // solo pueda ajustar puntos de cursos de su propia institución.
    usuarioRol?: string,
    usuarioInstitucionId?: string | null,
    ip?: string,
  ) {
    // COMENTADO: antes buscaba Estudiante.
    // const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
    // if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

    // FIX: todo el cambio de saldo va dentro de una transacción con lock
    // pesimista sobre el curso, igual que en canjes.service.ts, para que
    // dos ajustes de puntos simultáneos sobre el mismo curso no se pisen
    // (antes se leía el curso, se modificaba en memoria y se guardaba sin
    // ningún bloqueo, lo que podía perder un incremento/decremento si dos
    // peticiones llegaban casi al mismo tiempo).
    //
    // NUEVO: se usa createQueryBuilder (no manager.findOne) para poder
    // filtrar por institucion_id directo en SQL sin depender de la
    // propiedad `institucion_id` de la entidad Curso, que está mal tipada
    // (declarada como relación @ManyToOne pero tipada como string).
    const { curso, puntosAnteriores, transaccion } = await this.dataSource.transaction(async (manager) => {
      const cursoQuery = manager
        .createQueryBuilder(Curso, 'c')
        .where('c.id = :id', { id: dto.curso_id })
        .setLock('pessimistic_write');

      if (usuarioRol !== 'ADMIN') {
        cursoQuery.andWhere('c.institucion_id = :institucion_id', { institucion_id: usuarioInstitucionId });
      }

      const curso = await cursoQuery.getOne();
      if (!curso) throw new NotFoundException(`Curso ${dto.curso_id} no encontrado`);

      // COMENTADO: antes usaba estudiante.puntos.
      // const puntosAnteriores = estudiante.puntos;
      const puntosAnteriores = curso.puntos;

      if (dto.tipo === TipoTransaccion.RESTA || dto.tipo === TipoTransaccion.CANJE) {
        // COMENTADO: antes validaba/restaba sobre estudiante.
        // if (estudiante.puntos < dto.puntos) {
        //   throw new BadRequestException(`Puntos insuficientes. Tiene ${estudiante.puntos}, necesita ${dto.puntos}`);
        // }
        // estudiante.puntos -= dto.puntos;
        if (curso.puntos < dto.puntos) {
          throw new BadRequestException(`Puntos insuficientes. Tiene ${curso.puntos}, necesita ${dto.puntos}`);
        }
        curso.puntos -= dto.puntos;
      } else {
        // COMENTADO: estudiante.puntos += dto.puntos;
        curso.puntos += dto.puntos;
      }

      // COMENTADO: await this.estudianteRepository.save(estudiante);
      await manager.save(curso);

      const transaccion = manager.create(HistorialPuntos, {
        // COMENTADO: estudiante,
        curso,
        tipo: dto.tipo,
        puntos: dto.puntos,
        descripcion: dto.descripcion,
      });
      await manager.save(transaccion);

      return { curso, puntosAnteriores, transaccion };
    });

    // Auditoría fuera de la transacción crítica (no debe bloquear el ajuste si falla)
    try {
      await this.auditoriaService.registrar({
        tabla: 'historial_puntos',
        accion: AccionAuditoria.CREATE,
        registro_id: transaccion.id,
        datos_anteriores: { puntos: puntosAnteriores },
        datos_nuevos: {
          tipo: dto.tipo,
          puntos: dto.puntos,
          descripcion: dto.descripcion,
          // COMENTADO: puntos_resultantes: estudiante.puntos,
          puntos_resultantes: curso.puntos,
        },
        usuario_id: usuarioId,
        usuario_email: usuarioEmail,
        ip,
      });
    } catch (err) {
      console.error('Error al registrar auditoría:', err);
    }

    // COMENTADO: return { estudiante, transaccion };
    return { curso, transaccion };
  }

  async getHistorial(curso_id: string, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<HistorialPuntos[]> {
    // COMENTADO: antes buscaba y filtraba por Estudiante.
    // const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
    // if (!estudiante) throw new NotFoundException(`Estudiante ${estudiante_id} no encontrado`);
    const curso = await this.cursoRepository.findOne({ where: { id: curso_id } });
    if (!curso) throw new NotFoundException(`Curso ${curso_id} no encontrado`);

    // NUEVO: si no es ADMIN, valida que el curso pertenezca a su institución.
    if (usuarioRol && usuarioRol !== 'ADMIN') {
      const pertenece = await this.cursoRepository
        .createQueryBuilder('c')
        .where('c.id = :curso_id AND c.institucion_id = :institucion_id', { curso_id, institucion_id: usuarioInstitucionId })
        .getExists();
      if (!pertenece) throw new NotFoundException(`Curso ${curso_id} no encontrado`);
    }

    return this.historialRepository.find({
      // COMENTADO: where: { estudiante: { id: estudiante_id } },
      where: { curso: { id: curso_id } },
      order: { created_at: 'DESC' },
    });
  }
}