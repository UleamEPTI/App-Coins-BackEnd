import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';

export interface FiltrosCurso {
  search?: string;
  institucion_id?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
  sort?: 'nombre' | 'created_at' | 'paralelo';
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async create(dto: CreateCursoDto): Promise<Curso> {
    const curso = this.cursoRepository.create(dto);
    return this.cursoRepository.save(curso);
  }

  async findAll(filtros: FiltrosCurso = {}) {
    const {
      search,
      institucion_id,
      activo,
      page = 1,
      limit = 20,
      sort = 'nombre',
      order = 'ASC',
    } = filtros;

    const query = this.cursoRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.institucion', 'i');

    if (search) {
      query.andWhere(
        '(LOWER(c.nombre) LIKE :search OR LOWER(c.paralelo) LIKE :search OR LOWER(c.descripcion) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (institucion_id) {
      query.andWhere('c.institucion_id = :institucion_id', { institucion_id });
    }

    if (activo !== undefined) {
      query.andWhere('c.activo = :activo', { activo });
    } else {
      query.andWhere('c.activo = true');
    }

    const total = await query.getCount();

    query
      .orderBy(`c.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const data = await query.getMany();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByInstitucion(institucion_id: string): Promise<Curso[]> {
    return this.cursoRepository.find({
      where: { institucion_id, activo: true },
      relations: ['institucion'],
    });
  }

  async findOne(id: string): Promise<Curso> {
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: ['institucion'],
    });
    if (!curso) throw new NotFoundException(`Curso ${id} no encontrado`);
    return curso;
  }

  async update(id: string, dto: Partial<CreateCursoDto>): Promise<Curso> {
    const curso = await this.findOne(id);
    Object.assign(curso, dto);
    return this.cursoRepository.save(curso);
  }

  async remove(id: string): Promise<{ message: string }> {
    const curso = await this.findOne(id);
    curso.activo = false;
    await this.cursoRepository.save(curso);
    return { message: 'Curso desactivado correctamente' };
  }
}