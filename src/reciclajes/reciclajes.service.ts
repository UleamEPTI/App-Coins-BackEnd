import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reciclaje } from './entities/reciclaje.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { TipoBotella } from '../tipos-botella/entities/tipo-botella.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { HistorialPuntos, TipoTransaccion } from '../puntos/entities/historial-puntos.entity';
import { CreateReciclajeDto } from './dto/create-reciclaje.dto';
import { AuditoriaService, AuditoriaPayload } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';

@Injectable()
export class ReciclajesService {
  constructor(
    @InjectRepository(Reciclaje)
    private readonly reciclajeRepository: Repository<Reciclaje>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(TipoBotella)
    private readonly tipoBotellaRepository: Repository<TipoBotella>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async registrar(dto: CreateReciclajeDto, registradoPorId: string, ip?: string): Promise<Reciclaje> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
    if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

    const tipoBotella = await this.tipoBotellaRepository.findOne({ where: { id: dto.tipo_botella_id, activo: true } });
    if (!tipoBotella) throw new NotFoundException(`Tipo de botella ${dto.tipo_botella_id} no encontrado`);

    const registradoPor = await this.usuarioRepository.findOne({ 
      where: { id: registradoPorId },
      select: ['id', 'nombres', 'apellidos', 'email'],
    });

    if (!registradoPor) throw new NotFoundException(`Usuario ${registradoPorId} no encontrado`);

    const puntosGanados = tipoBotella.puntos * dto.cantidad;

    // Sumar puntos al estudiante
    estudiante.puntos += puntosGanados;
    await this.estudianteRepository.save(estudiante);

    // Registrar en historial
    const historial = this.historialRepository.create({
      estudiante,
      tipo: TipoTransaccion.SUMA,
      puntos: puntosGanados,
      descripcion: `Reciclaje: ${dto.cantidad} botella(s) de ${tipoBotella.tamano}`,
    });
    await this.historialRepository.save(historial);

    // Guardar registro de reciclaje
    const reciclaje = this.reciclajeRepository.create({
      estudiante,
      tipo_botella: tipoBotella,
      registrado_por: registradoPor,
      cantidad: dto.cantidad,
      puntos_ganados: puntosGanados,
    });
    const saved = await this.reciclajeRepository.save(reciclaje);

    // Auditoría
    await this.auditoriaService.registrar({
      tabla: 'reciclajes',
      accion: AccionAuditoria.CREATE,
      registro_id: saved.id,
      datos_nuevos: {
        estudiante_id: dto.estudiante_id,
        tipo_botella: tipoBotella.tamano,
        cantidad: dto.cantidad,
        puntos_ganados: puntosGanados,
      },
      usuario_id: registradoPorId,
      usuario_email: registradoPor.email,
      ip,
    });

    return saved;
  }

  async findAll(): Promise<Reciclaje[]> {
    return this.reciclajeRepository.find({
      relations: ['estudiante', 'tipo_botella', 'registrado_por'],
      order: { created_at: 'DESC' },
    });
  }

  async findByEstudiante(estudiante_id: string): Promise<Reciclaje[]> {
    return this.reciclajeRepository.find({
      where: { estudiante: { id: estudiante_id } },
      relations: ['tipo_botella'],
      order: { created_at: 'DESC' },
    });
  }

  async findByInstitucion(institucion_id: string): Promise<Reciclaje[]> {
    return this.reciclajeRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.estudiante', 'e')
      .leftJoinAndSelect('r.tipo_botella', 'tb')
      .leftJoinAndSelect('r.registrado_por', 'u')
      .leftJoinAndSelect('e.curso', 'c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .orderBy('r.created_at', 'DESC')
      .getMany();
  }

  async findByCurso(curso_id: string): Promise<Reciclaje[]> {
    return this.reciclajeRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.estudiante', 'e')
      .leftJoinAndSelect('r.tipo_botella', 'tb')
      .leftJoinAndSelect('e.curso', 'c')
      .where('e.curso_id = :curso_id', { curso_id })
      .orderBy('r.created_at', 'DESC')
      .getMany();
  }
} 