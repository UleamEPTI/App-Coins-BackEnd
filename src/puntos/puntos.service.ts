import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialPuntos, TipoTransaccion } from '../historial/entities/historial-puntos.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';

@Injectable()
export class PuntosService {
  constructor(
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async modificarPuntos(dto: ModificarPuntosDto): Promise<{ estudiante: Estudiante; transaccion: HistorialPuntos }> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
    if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

    if (dto.tipo === TipoTransaccion.RESTA || dto.tipo === TipoTransaccion.CANJE) {
      if (estudiante.puntos < dto.puntos) {
        throw new BadRequestException(`Puntos insuficientes. Tiene ${estudiante.puntos}, necesita ${dto.puntos}`);
      }
      estudiante.puntos -= dto.puntos;
    } else {
      estudiante.puntos += dto.puntos;
    }

    await this.estudianteRepository.save(estudiante);

    const transaccion = this.historialRepository.create({
      estudiante,
      tipo: dto.tipo,
      puntos: dto.puntos,
      descripcion: dto.descripcion,
    });
    await this.historialRepository.save(transaccion);

    return { estudiante, transaccion };
  }

  async getHistorial(estudiante_id: string): Promise<HistorialPuntos[]> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
    if (!estudiante) throw new NotFoundException(`Estudiante ${estudiante_id} no encontrado`);

    return this.historialRepository.find({
      where: { estudiante: { id: estudiante_id } },
      order: { created_at: 'DESC' },
    });
  }
}