import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reciclaje } from './entities/reciclaje.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { HistorialPuntos, TipoTransaccion } from '../puntos/entities/historial-puntos.entity';
import { CreateReciclajeDto } from './dto/create-reciclaje.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';
// COMENTADO: ya no se usan, ver reemplazo por Curso más abajo.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';
// import { TipoBotella } from '../tipos-botella/entities/tipo-botella.entity';

// TODO: 1 kilo = 1 moneda es un valor temporal. Reemplazar cuando Bachillero
// envíe la tabla de conversión oficial (puede variar por tipo de material).
const KILOS_A_MONEDAS = 1;

@Injectable()
export class ReciclajesService {
  constructor(
    @InjectRepository(Reciclaje)
    private readonly reciclajeRepository: Repository<Reciclaje>,
    // COMENTADO: antes inyectaba Estudiante y TipoBotella, ahora solo Curso.
    // @InjectRepository(Estudiante)
    // private readonly estudianteRepository: Repository<Estudiante>,
    // @InjectRepository(TipoBotella)
    // private readonly tipoBotellaRepository: Repository<TipoBotella>,
    // COMENTADO: ya no se usa este repo directo; el curso ahora se busca
    // dentro de la transacción vía manager.findOne con lock pesimista
    // (ver método registrar), para evitar la condición de carrera.
    // @InjectRepository(Curso)
    // private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
    private readonly auditoriaService: AuditoriaService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async registrar(dto: CreateReciclajeDto, registradoPorId: string, ip?: string): Promise<Reciclaje> {
    // COMENTADO: antes buscaba Estudiante y TipoBotella por separado.
    // const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
    // if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);
    //
    // const tipoBotella = await this.tipoBotellaRepository.findOne({ where: { id: dto.tipo_botella_id, activo: true } });
    // if (!tipoBotella) throw new NotFoundException(`Tipo de botella ${dto.tipo_botella_id} no encontrado`);

    const registradoPor = await this.usuarioRepository.findOne({
      where: { id: registradoPorId },
      select: ['id', 'nombres', 'apellidos', 'email'],
    });
    if (!registradoPor) throw new NotFoundException(`Usuario ${registradoPorId} no encontrado`);

    // COMENTADO: antes se multiplicaba tipoBotella.puntos * dto.cantidad.
    // const puntosGanados = tipoBotella.puntos * dto.cantidad;
    const puntosGanados = dto.kilos * KILOS_A_MONEDAS;

    // Todo dentro de una sola transacción: si algo falla, se revierte todo.
    // FIX: el curso se busca DENTRO de la transacción con lock pesimista,
    // para que dos registros simultáneos sobre el mismo curso no se pisen
    // el saldo de puntos (antes se leía el curso fuera del lock y podía
    // perderse un incremento si dos personas registraban al mismo tiempo).
    const saved = await this.dataSource.transaction(async (manager) => {
      const curso = await manager.findOne(Curso, {
        where: { id: dto.curso_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!curso) throw new NotFoundException(`Curso ${dto.curso_id} no encontrado`);

      // COMENTADO: antes sumaba puntos al estudiante.
      // estudiante.puntos += puntosGanados;
      // await manager.save(estudiante);
      curso.puntos += puntosGanados;
      await manager.save(curso);

      const historial = manager.create(HistorialPuntos, {
        // COMENTADO: antes se guardaba estudiante en vez de curso.
        // estudiante,
        curso,
        tipo: TipoTransaccion.SUMA,
        puntos: puntosGanados,
        // COMENTADO: antes describía botellas por tamaño.
        // descripcion: `Reciclaje: ${dto.cantidad} botella(s) de ${tipoBotella.tamano}`,
        descripcion: `Reciclaje: ${dto.kilos} kilo(s)`,
      });
      await manager.save(historial);

      const reciclaje = manager.create(Reciclaje, {
        // COMENTADO: antes guardaba estudiante y tipo_botella.
        // estudiante,
        // tipo_botella: tipoBotella,
        // cantidad: dto.cantidad,
        curso,
        registrado_por: registradoPor,
        kilos: dto.kilos,
        puntos_ganados: puntosGanados,
      });
      return manager.save(reciclaje);
    });

    // Auditoría fuera de la transacción crítica (no debe bloquear el reciclaje si falla)
    try {
      await this.auditoriaService.registrar({
        tabla: 'reciclajes',
        accion: AccionAuditoria.CREATE,
        registro_id: saved.id,
        datos_nuevos: {
          // COMENTADO: antes registraba estudiante_id, tipo_botella, cantidad.
          // estudiante_id: dto.estudiante_id,
          // tipo_botella: tipoBotella.tamano,
          // cantidad: dto.cantidad,
          curso_id: dto.curso_id,
          kilos: dto.kilos,
          puntos_ganados: puntosGanados,
        },
        usuario_id: registradoPorId,
        usuario_email: registradoPor.email,
        ip,
      });
    } catch (err) {
      // Log del error pero no falla la operación principal
      console.error('Error al registrar auditoría:', err);
    }

    return saved;
  }

  async findAll(): Promise<Reciclaje[]> {
    return this.reciclajeRepository.find({
      // COMENTADO: antes incluía 'estudiante' y 'tipo_botella'.
      // relations: ['estudiante', 'tipo_botella', 'registrado_por'],
      relations: ['curso', 'registrado_por'],
      order: { created_at: 'DESC' },
    });
  }

  // COMENTADO: ya no existe estudiante individual, se reemplaza por findByCurso.
  // async findByEstudiante(estudiante_id: string): Promise<Reciclaje[]> {
  //   return this.reciclajeRepository.find({
  //     where: { estudiante: { id: estudiante_id } },
  //     relations: ['tipo_botella'],
  //     order: { created_at: 'DESC' },
  //   });
  // }

  async findByInstitucion(institucion_id: string): Promise<Reciclaje[]> {
    return this.reciclajeRepository
      .createQueryBuilder('r')
      // COMENTADO: antes hacía join con estudiante -> curso; ahora curso es directo.
      // .leftJoinAndSelect('r.estudiante', 'e')
      // .leftJoinAndSelect('r.tipo_botella', 'tb')
      // .leftJoinAndSelect('r.registrado_por', 'u')
      // .leftJoinAndSelect('e.curso', 'c')
      .leftJoinAndSelect('r.curso', 'c')
      .leftJoinAndSelect('r.registrado_por', 'u')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .orderBy('r.created_at', 'DESC')
      .getMany();
  }

  async findByCurso(curso_id: string): Promise<Reciclaje[]> {
    // COMENTADO: antes hacía join con estudiante -> curso_id.
    // return this.reciclajeRepository
    //   .createQueryBuilder('r')
    //   .leftJoinAndSelect('r.estudiante', 'e')
    //   .leftJoinAndSelect('r.tipo_botella', 'tb')
    //   .leftJoinAndSelect('e.curso', 'c')
    //   .where('e.curso_id = :curso_id', { curso_id })
    //   .orderBy('r.created_at', 'DESC')
    //   .getMany();
    return this.reciclajeRepository.find({
      where: { curso: { id: curso_id } },
      relations: ['registrado_por'],
      order: { created_at: 'DESC' },
    });
  }

  async findByRegistradoPor(registrado_por_id: string): Promise<Reciclaje[]> {
    return this.reciclajeRepository.find({
      where: { registrado_por: { id: registrado_por_id } },
      // COMENTADO: antes incluía 'estudiante' y 'tipo_botella'.
      // relations: ['estudiante', 'tipo_botella'],
      relations: ['curso'],
      order: { created_at: 'DESC' },
    });
  }
}