import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Canje } from '../canjes/entities/canje.entity';
// COMENTADO: antes usaba Estudiante, ahora usa Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    // COMENTADO: antes inyectaba Estudiante.
    // @InjectRepository(Estudiante)
    // private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Reciclaje)
    private readonly reciclajeRepository: Repository<Reciclaje>,
    @InjectRepository(Canje)
    private readonly canjeRepository: Repository<Canje>,
  ) {}

  // Ranking de cursos dentro de una institución (antes era ranking de
  // estudiantes por curso/institución).
  //
  // COMENTADO (versión anterior, por estudiante):
  // async rankingCurso(curso_id: string) {
  //   return this.estudianteRepository
  //     .createQueryBuilder('e')
  //     .leftJoinAndSelect('e.usuario', 'u')
  //     .where('e.curso_id = :curso_id', { curso_id })
  //     .andWhere('e.activo = true')
  //     .orderBy('e.puntos', 'DESC')
  //     .select(['e.id', 'e.puntos', 'e.codigo_estudiante', 'u.nombres', 'u.apellidos'])
  //     .getMany();
  // }

  async rankingInstitucion(institucion_id: string) {
    // COMENTADO (versión anterior, por estudiante):
    // return this.estudianteRepository
    //   .createQueryBuilder('e')
    //   .leftJoinAndSelect('e.usuario', 'u')
    //   .leftJoinAndSelect('e.curso', 'c')
    //   .where('c.institucion_id = :institucion_id', { institucion_id })
    //   .andWhere('e.activo = true')
    //   .orderBy('e.puntos', 'DESC')
    //   .select(['e.id', 'e.puntos', 'e.codigo_estudiante', 'u.nombres', 'u.apellidos', 'c.nombre', 'c.paralelo'])
    //   .getMany();
    return this.cursoRepository
      .createQueryBuilder('c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .andWhere('c.activo = true')
      .orderBy('c.puntos', 'DESC')
      .select(['c.id', 'c.puntos', 'c.nombre', 'c.paralelo'])
      .getMany();
  }

  // Estadísticas generales de una institución
  async statsInstitucion(institucion_id: string) {
    // COMENTADO: antes contaba Estudiante; ahora cuenta Curso.
    // const totalEstudiantes = await this.estudianteRepository
    //   .createQueryBuilder('e')
    //   .leftJoin('e.curso', 'c')
    //   .where('c.institucion_id = :institucion_id', { institucion_id })
    //   .andWhere('e.activo = true')
    //   .getCount();
    const totalCursos = await this.cursoRepository
      .createQueryBuilder('c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .andWhere('c.activo = true')
      .getCount();

    // COMENTADO: antes hacía join r.estudiante -> e.curso y traía tipo_botella.
    // const reciclajes = await this.reciclajeRepository
    //   .createQueryBuilder('r')
    //   .leftJoin('r.estudiante', 'e')
    //   .leftJoin('e.curso', 'c')
    //   .leftJoinAndSelect('r.tipo_botella', 'tb')
    //   .where('c.institucion_id = :institucion_id', { institucion_id })
    //   .getMany();
    const reciclajes = await this.reciclajeRepository
      .createQueryBuilder('r')
      .leftJoin('r.curso', 'c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .getMany();

    // COMENTADO: antes sumaba cantidad de botellas; ahora suma kilos.
    // const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
    const totalKilos = reciclajes.reduce((sum, r) => sum + r.kilos, 0);
    const totalPuntosGenerados = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);

    // COMENTADO: ya no hay tipos de botella, todo es kilos.
    // const botellaPorTipo: Record<string, number> = {};
    // reciclajes.forEach(r => {
    //   const tamano = r.tipo_botella?.tamano ?? 'desconocido';
    //   botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
    // });

    // COMENTADO: antes hacía join cj.estudiante -> e.curso.
    // const totalCanjes = await this.canjeRepository
    //   .createQueryBuilder('cj')
    //   .leftJoin('cj.estudiante', 'e')
    //   .leftJoin('e.curso', 'c')
    //   .where('c.institucion_id = :institucion_id', { institucion_id })
    //   .getCount();
    const totalCanjes = await this.canjeRepository
      .createQueryBuilder('cj')
      .leftJoin('cj.curso', 'c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .getCount();

    return {
      // COMENTADO: totalEstudiantes,
      totalCursos,
      // COMENTADO: totalBotellas,
      totalKilos,
      totalPuntosGenerados,
      totalCanjes,
      // COMENTADO: botellaPorTipo,
    };
  }

  // Estadísticas de un curso
  async statsCurso(curso_id: string) {
    // COMENTADO: antes contaba Estudiante por curso_id.
    // const totalEstudiantes = await this.estudianteRepository
    //   .createQueryBuilder('e')
    //   .where('e.curso_id = :curso_id', { curso_id })
    //   .andWhere('e.activo = true')
    //   .getCount();

    // COMENTADO: antes hacía join r.estudiante -> e.curso_id y traía tipo_botella.
    // const reciclajes = await this.reciclajeRepository
    //   .createQueryBuilder('r')
    //   .leftJoin('r.estudiante', 'e')
    //   .leftJoinAndSelect('r.tipo_botella', 'tb')
    //   .where('e.curso_id = :curso_id', { curso_id })
    //   .getMany();
    const reciclajes = await this.reciclajeRepository
      .createQueryBuilder('r')
      .where('r.curso_id = :curso_id', { curso_id })
      .getMany();

    // COMENTADO: const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
    const totalKilos = reciclajes.reduce((sum, r) => sum + r.kilos, 0);
    const totalPuntosGenerados = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);

    // COMENTADO: ya no hay tipos de botella.
    // const botellaPorTipo: Record<string, number> = {};
    // reciclajes.forEach(r => {
    //   const tamano = r.tipo_botella?.tamano ?? 'desconocido';
    //   botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
    // });

    return {
      // COMENTADO: totalEstudiantes,
      // COMENTADO: totalBotellas,
      totalKilos,
      totalPuntosGenerados,
      // COMENTADO: botellaPorTipo,
    };
  }
}