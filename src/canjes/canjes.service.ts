import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Canje, EstadoCanje } from './entities/canje.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Premio } from '../premios/entities/premio.entity';
import { HistorialPuntos, TipoTransaccion } from '../historial/entities/historial-puntos.entity';
import { CreateCanjeDto } from './dto/create-canje.dto';

@Injectable()
export class CanjesService {
  constructor(
    @InjectRepository(Canje)
    private readonly canjeRepository: Repository<Canje>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Premio)
    private readonly premioRepository: Repository<Premio>,
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
  ) {}

  async canjear(dto: CreateCanjeDto): Promise<Canje> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
    if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

    const premio = await this.premioRepository.findOne({ where: { id: dto.premio_id, activo: true } });
    if (!premio) throw new NotFoundException(`Premio ${dto.premio_id} no encontrado o inactivo`);

    if (premio.stock <= 0) throw new BadRequestException('El premio no tiene stock disponible');

    if (estudiante.puntos < premio.costo_puntos) {
      throw new BadRequestException(
        `Puntos insuficientes. Tiene ${estudiante.puntos}, necesita ${premio.costo_puntos}`,
      );
    }

    // Descontar puntos y stock
    estudiante.puntos -= premio.costo_puntos;
    premio.stock -= 1;

    await this.estudianteRepository.save(estudiante);
    await this.premioRepository.save(premio);

    // Registrar en historial
    const historial = this.historialRepository.create({
      estudiante,
      tipo: TipoTransaccion.CANJE,
      puntos: premio.costo_puntos,
      descripcion: `Canje por premio: ${premio.nombre}`,
    });
    await this.historialRepository.save(historial);

    // Crear el canje
    const canje = this.canjeRepository.create({
      estudiante,
      premio,
      puntos_gastados: premio.costo_puntos,
      estado: EstadoCanje.PENDIENTE,
    });

    return this.canjeRepository.save(canje);
  }

  async findAll(): Promise<Canje[]> {
    return this.canjeRepository.find({
      relations: ['estudiante', 'premio'],
      order: { created_at: 'DESC' },
    });
  }

  async findByEstudiante(estudiante_id: string): Promise<Canje[]> {
    return this.canjeRepository.find({
      where: { estudiante: { id: estudiante_id } },
      relations: ['premio'],
      order: { created_at: 'DESC' },
    });
  }

  async actualizarEstado(id: string, estado: EstadoCanje): Promise<Canje> {
    const canje = await this.canjeRepository.findOne({ where: { id }, relations: ['estudiante', 'premio'] });
    if (!canje) throw new NotFoundException(`Canje ${id} no encontrado`);
    canje.estado = estado;
    return this.canjeRepository.save(canje);
  }
}