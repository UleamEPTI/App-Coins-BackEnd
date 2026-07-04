import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Curso } from './entities/curso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

export interface FiltrosEstudiante {
  search?: string;
  curso_id?: string;
  institucion_id?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
  sort?: 'apellidos' | 'puntos' | 'created_at' | 'codigo_estudiante';
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateEstudianteDto): Promise<Estudiante> {
    const usuario = await this.usuarioRepository.findOne({ where: { id: dto.usuario_id } });
    if (!usuario) throw new NotFoundException(`Usuario ${dto.usuario_id} no encontrado`);

    const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
    if (!curso) throw new NotFoundException(`Curso ${dto.curso_id} no encontrado`);

    const estudiante = this.estudianteRepository.create({
      usuario,
      curso,
      codigo_estudiante: dto.codigo_estudiante,
      fecha_nacimiento: dto.fecha_nacimiento ? new Date(dto.fecha_nacimiento) : undefined,
      direccion: dto.direccion,
    });

    return this.estudianteRepository.save(estudiante);
  }

  async findAll(filtros: FiltrosEstudiante = {}) {
    const {
      search,
      curso_id,
      institucion_id,
      activo,
      page = 1,
      limit = 20,
      sort = 'apellidos',
      order = 'ASC',
    } = filtros;

    const query = this.estudianteRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.usuario', 'u')
      .leftJoinAndSelect('e.curso', 'c');

    if (activo !== undefined) {
      query.andWhere('e.activo = :activo', { activo });
    } else {
      query.andWhere('e.activo = true');
    }

    if (curso_id) {
      query.andWhere('e.curso_id = :curso_id', { curso_id });
    }

    if (institucion_id) {
      query.andWhere('c.institucion_id = :institucion_id', { institucion_id });
    }

    if (search) {
      query.andWhere(
        '(LOWER(u.nombres) LIKE :search OR LOWER(u.apellidos) LIKE :search OR LOWER(e.codigo_estudiante) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const total = await query.getCount();

    // Sort dinámico
    if (sort === 'apellidos') {
      query.orderBy('u.apellidos', order);
    } else if (sort === 'puntos') {
      query.orderBy('e.puntos', order);
    } else {
      query.orderBy(`e.${sort}`, order);
    }

    query.skip((page - 1) * limit).take(limit);

    const data = await query.getMany();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['usuario', 'curso'],
    });
    if (!estudiante) throw new NotFoundException(`Estudiante ${id} no encontrado`);
    return estudiante;
  }

  async update(id: string, dto: Partial<CreateEstudianteDto>): Promise<Estudiante> {
    const estudiante = await this.findOne(id);

    if (dto.usuario_id) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: dto.usuario_id } });
      if (!usuario) throw new NotFoundException(`Usuario ${dto.usuario_id} no encontrado`);
      estudiante.usuario = usuario;
    }

    if (dto.curso_id) {
      const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
      if (!curso) throw new NotFoundException(`Curso ${dto.curso_id} no encontrado`);
      estudiante.curso = curso;
    }

    if (dto.codigo_estudiante !== undefined) estudiante.codigo_estudiante = dto.codigo_estudiante;
    if (dto.fecha_nacimiento) estudiante.fecha_nacimiento = new Date(dto.fecha_nacimiento);
    if (dto.direccion !== undefined) estudiante.direccion = dto.direccion;

    return this.estudianteRepository.save(estudiante);
  }

  async remove(id: string): Promise<{ message: string }> {
    const estudiante = await this.findOne(id);
    estudiante.activo = false;
    await this.estudianteRepository.save(estudiante);
    return { message: `Estudiante ${id} desactivado correctamente` };
  }
}