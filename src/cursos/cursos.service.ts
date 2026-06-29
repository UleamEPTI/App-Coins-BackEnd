import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';

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

  async findAll(): Promise<Curso[]> {
    return this.cursoRepository.find({ relations: ['institucion'] });
  }

  async findByInstitucion(institucion_id: string): Promise<Curso[]> {
    return this.cursoRepository.find({
      where: { institucion_id },
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