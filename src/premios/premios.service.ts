import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Premio } from './entities/premio.entity';
import { CreatePremioDto } from './dto/create-premio.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';

@Injectable()
export class PremiosService {
  constructor(
    @InjectRepository(Premio)
    private readonly premioRepository: Repository<Premio>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async create(dto: CreatePremioDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Premio> {
    const premio = this.premioRepository.create(dto);
    const saved = await this.premioRepository.save(premio);

    await this.auditoriaService.registrar({
      tabla: 'premios',
      accion: AccionAuditoria.CREATE,
      registro_id: saved.id,
      datos_nuevos: { nombre: dto.nombre, costo_puntos: dto.costo_puntos, stock: dto.stock },
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    return saved;
  }

  async findAll(): Promise<Premio[]> {
    return this.premioRepository.find({ where: { activo: true } });
  }

  async findOne(id: string): Promise<Premio> {
    const premio = await this.premioRepository.findOne({ where: { id } });
    if (!premio) throw new NotFoundException(`Premio ${id} no encontrado`);
    return premio;
  }

  async update(id: string, dto: Partial<CreatePremioDto>, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Premio> {
    const premio = await this.findOne(id);
    const anterior = { nombre: premio.nombre, costo_puntos: premio.costo_puntos, stock: premio.stock };

    Object.assign(premio, dto);
    const saved = await this.premioRepository.save(premio);

    await this.auditoriaService.registrar({
      tabla: 'premios',
      accion: AccionAuditoria.UPDATE,
      registro_id: id,
      datos_anteriores: anterior,
      datos_nuevos: dto,
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    return saved;
  }

  async remove(id: string, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<{ message: string }> {
    const premio = await this.findOne(id);

    premio.activo = false;
    await this.premioRepository.save(premio);

    await this.auditoriaService.registrar({
      tabla: 'premios',
      accion: AccionAuditoria.DELETE,
      registro_id: id,
      datos_anteriores: { nombre: premio.nombre, activo: true },
      datos_nuevos: { activo: false },
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    return { message: `Premio ${id} desactivado correctamente` };
  }
}