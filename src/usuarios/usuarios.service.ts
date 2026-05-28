import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async findAll() {
    return this.usuarioRepository.find({
      relations: ['rol'],
      select: ['id', 'nombres', 'apellidos', 'email', 'cedula', 'telefono', 'activo', 'created_at'],
    });
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol'],
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { email },
      relations: ['rol'],
    });
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol'],
    });
  }

  async findByInstitucion(institucion_id: string) {
    return this.usuarioRepository.find({
      where: { institucion_id },
      relations: ['rol'],
    });
  }

  async create(dto: CreateUsuarioDto) {
    const existe = await this.usuarioRepository.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('El email ya está registrado');

    const rol = await this.rolRepository.findOne({ where: { id: dto.rol_id } });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    const hash = await bcrypt.hash(dto.password, 10);

    const usuario = this.usuarioRepository.create({
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      email: dto.email,
      cedula: dto.cedula,
      telefono: dto.telefono,
      password_hash: hash,
      rol,
      institucion_id: dto.institucion_id,
      curso_id: dto.curso_id,
      activo: true,
    });

    const saved = await this.usuarioRepository.save(usuario);
    const { password_hash, ...result } = saved;
    return result;
  }

  async update(id: string, dto: Partial<CreateUsuarioDto>) {
    const usuario = await this.findOne(id);

    if (dto.password) {
      (usuario as any).password_hash = await bcrypt.hash(dto.password, 10);
    }
    if (dto.nombres) usuario.nombres = dto.nombres;
    if (dto.apellidos) usuario.apellidos = dto.apellidos;
    if (dto.cedula) usuario.cedula = dto.cedula;
    if (dto.telefono) usuario.telefono = dto.telefono;
    if (dto.institucion_id) usuario.institucion_id = dto.institucion_id;
    if (dto.curso_id) usuario.curso_id = dto.curso_id;

    const saved = await this.usuarioRepository.save(usuario);
    const { password_hash, ...result } = saved;
    return result;
  }

  async remove(id: string) {
    const usuario = await this.findOne(id);
    usuario.activo = false;
    await this.usuarioRepository.save(usuario);
    return { message: 'Usuario desactivado correctamente' };
  }

  async getRoles() {
    return this.rolRepository.find();
  }
} 