import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institucion } from './entities/institucion.entity';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity';

export interface FiltrosInstitucion {
  search?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
  sort?: 'nombre' | 'created_at' | 'codigo';
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class InstitucionesService {
  constructor(
    @InjectRepository(Institucion)
    private readonly institucionRepository: Repository<Institucion>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async create(dto: CreateInstitucionDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Institucion> {
    const existe = await this.institucionRepository.findOne({ where: { codigo: dto.codigo } });
    if (existe) throw new ConflictException('Ya existe una institución con ese código');

    const institucion = this.institucionRepository.create(dto);
    const saved = await this.institucionRepository.save(institucion);

    await this.auditoriaService.registrar({
      tabla: 'instituciones',
      accion: AccionAuditoria.CREATE,
      registro_id: saved.id,
      datos_nuevos: { nombre: dto.nombre, codigo: dto.codigo },
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    return saved;
  }

  async findAll(filtros: FiltrosInstitucion = {}) {
    const {
      search,
      activo,
      page = 1,
      limit = 20,
      sort = 'nombre',
      order = 'ASC',
    } = filtros;

    const query = this.institucionRepository.createQueryBuilder('i');

    if (search) {
      query.andWhere(
        '(LOWER(i.nombre) LIKE :search OR LOWER(i.codigo) LIKE :search OR LOWER(i.dominio) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (activo !== undefined) {
      query.andWhere('i.activo = :activo', { activo });
    } else {
      query.andWhere('i.activo = true');
    }

    const total = await query.getCount();

    query
      .orderBy(`i.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const data = await query.getMany();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Institucion> {
    const inst = await this.institucionRepository.findOne({ where: { id } });
    if (!inst) throw new NotFoundException(`Institución ${id} no encontrada`);
    return inst;
  }

  async update(id: string, dto: Partial<CreateInstitucionDto>, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Institucion> {
    const inst = await this.findOne(id);
    const anterior = { nombre: inst.nombre, codigo: inst.codigo };

    Object.assign(inst, dto);
    const saved = await this.institucionRepository.save(inst);

    await this.auditoriaService.registrar({
      tabla: 'instituciones',
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
    const inst = await this.findOne(id);

    inst.activo = false;
    await this.institucionRepository.save(inst);

    await this.auditoriaService.registrar({
      tabla: 'instituciones',
      accion: AccionAuditoria.DELETE,
      registro_id: id,
      datos_anteriores: { nombre: inst.nombre, activo: true },
      datos_nuevos: { activo: false },
      usuario_id: usuarioId,
      usuario_email: usuarioEmail,
      ip,
    });

    return { message: `Institución ${id} desactivada correctamente` };
  }
}