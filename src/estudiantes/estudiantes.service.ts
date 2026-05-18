import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Curso } from './entities/curso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

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

  async findAll(): Promise<Estudiante[]> {
    return this.estudianteRepository.find({
      relations: ['usuario', 'curso'],
      where: { activo: true },
    });
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