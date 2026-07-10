import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialPuntos, TipoTransaccion } from './entities/historial-puntos.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';
// COMENTADO: antes usaba Estudiante, ahora usa Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';

@Injectable()
export class PuntosService {
  constructor(
    @InjectRepository(HistorialPuntos)
    private readonly historialRepository: Repository<HistorialPuntos>,
    // COMENTADO: antes inyectaba Estudiante.
    // @InjectRepository(Estudiante)
    // private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async modificarPuntos(dto: ModificarPuntosDto, usuarioId?: string, usuarioEmail?: string, ip?: string) {
    // COMENTADO: antes buscaba Estudiante.
    // const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
    // if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);

    const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
    if (!curso) throw new NotFoundException(`Curso ${dto.curso_id} no encontrado`);

    // COMENTADO: antes usaba estudiante.puntos.
    // const puntosAnteriores = estudiante.puntos;
    const puntosAnteriores = curso.puntos;

    if (dto.tipo === TipoTransaccion.RESTA || dto.tipo === TipoTransaccion.CANJE) {
      // COMENTADO: antes validaba/restaba sobre estudiante.
      // if (estudiante.puntos < dto.puntos) {
      //   throw new BadRequestException(`Puntos insuficientes. Tiene ${estudiante.puntos}, necesita ${dto.puntos}`);
      // }
      // estudiante.puntos -= dto.puntos;
      if (curso.puntos < dto.puntos) {
        throw new BadRequestException(`Puntos insuficientes. Tiene ${curso.puntos}, necesita ${dto.puntos}`);
      }
      curso.puntos -= dto.puntos;
    } else {
      // COMENTADO: estudiante.puntos += dto.puntos;
      curso.puntos += dto.puntos;
    }

    // COMENTADO: await this.estudianteRepository.save(estudiante);
    await this.cursoRepository.save(curso);

    const transaccion = this.historialRepository.create({
      // COMENTADO: estudiante,
      curso,
      tipo: dto.tipo,
      puntos: dto.puntos,
      descripcion: dto.descripcion,
    });
    await this.historialRepository.save(transaccion);

    // Auditoría
    await this.auditoriaService.registrar({
      tabla: 'historial_puntos',
      accion: AccionAuditoria.CREATE,
      registro_id: transaccion.id,
      datos_anteriores: { puntos: puntosAnteriores },
      datos_nuevos: {
        tipo: dto.tipo,
        puntos: dto.puntos,
        descripcion: dto.descripcion,
        // COMENTADO: puntos_resultantes: estudiante.puntos,
        puntos_resultantes: curso.puntos,
      },
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    // COMENTADO: return { estudiante, transaccion };
    return { curso, transaccion };
  }

  async getHistorial(curso_id: string): Promise<HistorialPuntos[]> {
    // COMENTADO: antes buscaba y filtraba por Estudiante.
    // const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
    // if (!estudiante) throw new NotFoundException(`Estudiante ${estudiante_id} no encontrado`);
    const curso = await this.cursoRepository.findOne({ where: { id: curso_id } });
    if (!curso) throw new NotFoundException(`Curso ${curso_id} no encontrado`);

    return this.historialRepository.find({
      // COMENTADO: where: { estudiante: { id: estudiante_id } },
      where: { curso: { id: curso_id } },
      order: { created_at: 'DESC' },
    });
  }
}