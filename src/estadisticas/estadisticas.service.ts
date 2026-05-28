import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Canje } from '../canjes/entities/canje.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Reciclaje)
    private readonly reciclajeRepository: Repository<Reciclaje>,
    @InjectRepository(Canje)
    private readonly canjeRepository: Repository<Canje>,
  ) {}

  // Ranking por curso
  async rankingCurso(curso_id: string) {
    return this.estudianteRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.usuario', 'u')
      .where('e.curso_id = :curso_id', { curso_id })
      .andWhere('e.activo = true')
      .orderBy('e.puntos', 'DESC')
      .select([
        'e.id',
        'e.puntos',
        'e.codigo_estudiante',
        'u.nombres',
        'u.apellidos',
      ])
      .getMany();
  }

  // Ranking por institución
  async rankingInstitucion(institucion_id: string) {
    return this.estudianteRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.usuario', 'u')
      .leftJoinAndSelect('e.curso', 'c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .andWhere('e.activo = true')
      .orderBy('e.puntos', 'DESC')
      .select([
        'e.id',
        'e.puntos',
        'e.codigo_estudiante',
        'u.nombres',
        'u.apellidos',
        'c.nombre',
        'c.paralelo',
      ])
      .getMany();
  }

  // Estadísticas generales de una institución
  async statsInstitucion(institucion_id: string) {
    const totalEstudiantes = await this.estudianteRepository
      .createQueryBuilder('e')
      .leftJoin('e.curso', 'c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .andWhere('e.activo = true')
      .getCount();

    const reciclajes = await this.reciclajeRepository
      .createQueryBuilder('r')
      .leftJoin('r.estudiante', 'e')
      .leftJoin('e.curso', 'c')
      .leftJoinAndSelect('r.tipo_botella', 'tb')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .getMany();

    const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
    const totalPuntosGenerados = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);

    // Botellas por tipo
    const botellaPorTipo: Record<string, number> = {};
    reciclajes.forEach(r => {
      const tamano = r.tipo_botella?.tamano ?? 'desconocido';
      botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
    });

    const totalCanjes = await this.canjeRepository
      .createQueryBuilder('cj')
      .leftJoin('cj.estudiante', 'e')
      .leftJoin('e.curso', 'c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .getCount();

    return {
      totalEstudiantes,
      totalBotellas,
      totalPuntosGenerados,
      totalCanjes,
      botellaPorTipo,
    };
  }

  // Estadísticas de un curso
  async statsCurso(curso_id: string) {
    const totalEstudiantes = await this.estudianteRepository
      .createQueryBuilder('e')
      .where('e.curso_id = :curso_id', { curso_id })
      .andWhere('e.activo = true')
      .getCount();

    const reciclajes = await this.reciclajeRepository
      .createQueryBuilder('r')
      .leftJoin('r.estudiante', 'e')
      .leftJoinAndSelect('r.tipo_botella', 'tb')
      .where('e.curso_id = :curso_id', { curso_id })
      .getMany();

    const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
    const totalPuntosGenerados = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);

    const botellaPorTipo: Record<string, number> = {};
    reciclajes.forEach(r => {
      const tamano = r.tipo_botella?.tamano ?? 'desconocido';
      botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
    });

    return {
      totalEstudiantes,
      totalBotellas,
      totalPuntosGenerados,
      botellaPorTipo,
    };
  }
}