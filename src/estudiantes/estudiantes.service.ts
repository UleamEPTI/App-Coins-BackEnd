import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
  ) {}

  async findAll() {
    return this.estudianteRepository.find({
      relations: ['usuario', 'curso'],
    });
  }

  async findOne(id: string) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['usuario', 'curso'],
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return estudiante;
  }

  async findByCurso(cursoId: string) {
    return this.estudianteRepository.find({
      where: { curso: { id: cursoId } },
      relations: ['usuario', 'curso'],
    });
  }

  async create(dto: CreateEstudianteDto) {
    const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const estudiante = this.estudianteRepository.create({
      usuario: { id: dto.usuario_id },
      curso: curso,
      codigo_estudiante: dto.codigo_estudiante,
      fecha_nacimiento: dto.fecha_nacimiento ? new Date(dto.fecha_nacimiento) : undefined,
      direccion: dto.direccion,
      puntos: 0,
      activo: true,
    });

    return this.estudianteRepository.save(estudiante);
  }

  async update(id: string, dto: Partial<CreateEstudianteDto>) {
    const estudiante = await this.findOne(id);

    if (dto.curso_id) {
      const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
      if (!curso) throw new NotFoundException('Curso no encontrado');
      estudiante.curso = curso;
    }
    if (dto.codigo_estudiante) estudiante.codigo_estudiante = dto.codigo_estudiante;
    if (dto.direccion) estudiante.direccion = dto.direccion;

    return this.estudianteRepository.save(estudiante);
  }

  async remove(id: string) {
    const estudiante = await this.findOne(id);
    estudiante.activo = false;
    await this.estudianteRepository.save(estudiante);
    return { message: 'Estudiante desactivado correctamente' };
  }

  async getCursos() {
    return this.cursoRepository.find({ where: { activo: true } });
  }

  async createCurso(nombre: string, paralelo: string, descripcion?: string) {
    const curso = this.cursoRepository.create({ nombre, paralelo, descripcion });
    return this.cursoRepository.save(curso);
  }
}