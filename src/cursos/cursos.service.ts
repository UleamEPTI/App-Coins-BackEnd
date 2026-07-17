import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';

export interface FiltrosCurso {
  search?: string;
  institucion_id?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
  sort?: 'nombre' | 'created_at' | 'paralelo';
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async create(dto: CreateCursoDto, usuarioRol: string, usuarioInstitucionId: string | null): Promise<Curso> {
    // NUEVO: si no es ADMIN, se ignora cualquier institucion_id que venga
    // en el body y se fuerza la del propio usuario, para que una
    // INSTITUCION no pueda crear un curso a nombre de otra institución.
    const institucion_id = usuarioRol === 'ADMIN' ? dto.institucion_id : usuarioInstitucionId;
    const curso = this.cursoRepository.create({ ...dto, institucion_id });
    return this.cursoRepository.save(curso);
  }

  async findAll(filtros: FiltrosCurso = {}, usuarioRol?: string, usuarioInstitucionId?: string | null) {
    const {
      search,
      // NUEVO: si no es ADMIN, se ignora el institucion_id que venga en
      // el query param y se fuerza el del propio usuario (antes un
      // DOCENTE/INSTITUCION podía pasar cualquier institucion_id y ver
      // cursos de otras instituciones).
      institucion_id = usuarioRol === 'ADMIN' ? filtros.institucion_id : usuarioInstitucionId,
      activo,
      page = 1,
      limit = 20,
      sort = 'nombre',
      order = 'ASC',
    } = filtros;

    const query = this.cursoRepository
      .createQueryBuilder('c')
      // FIX: la relación en la entidad Curso se llama 'institucion_id',
      // no 'institucion' (bug pre-existente: esto tiraba error en
      // tiempo de ejecución porque TypeORM no encontraba esa relación,
      // aunque compilaba bien porque los paths de relación son strings).
      .leftJoinAndSelect('c.institucion_id', 'i');

    if (search) {
      query.andWhere(
        '(LOWER(c.nombre) LIKE :search OR LOWER(c.paralelo) LIKE :search OR LOWER(c.descripcion) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (institucion_id) {
      query.andWhere('c.institucion_id = :institucion_id', { institucion_id });
    }

    if (activo !== undefined) {
      query.andWhere('c.activo = :activo', { activo });
    } else {
      query.andWhere('c.activo = true');
    }

    const total = await query.getCount();

    query
      .orderBy(`c.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const data = await query.getMany();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByInstitucion(institucion_id: string, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<Curso[]> {
    // NUEVO: si no es ADMIN y pide una institución que no es la suya, se
    // niega explícitamente (antes cualquiera podía consultar los cursos
    // de cualquier institución con solo saber su UUID).
    if (usuarioRol && usuarioRol !== 'ADMIN' && institucion_id !== usuarioInstitucionId) {
      throw new ForbiddenException('No tienes permiso para ver los cursos de esta institución');
    }

    return this.cursoRepository.find({
      where: { institucion_id, activo: true },
      // FIX: relación se llama 'institucion_id', no 'institucion'.
      relations: ['institucion_id'],
    });
  }

  async findOne(id: string, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<Curso> {
    const curso = await this.cursoRepository.findOne({
      where: { id },
      // FIX: relación se llama 'institucion_id', no 'institucion'.
      relations: ['institucion_id'],
    });
    if (!curso) throw new NotFoundException(`Curso ${id} no encontrado`);

    // NUEVO: si no es ADMIN, valida que el curso pertenezca a su propia
    // institución antes de devolverlo. Se compara vía consulta directa
    // (no leyendo curso.institucion_id ya cargado, para no depender del
    // tipado ambiguo de esa propiedad en la entidad).
    if (usuarioRol && usuarioRol !== 'ADMIN') {
      const pertenece = await this.cursoRepository
        .createQueryBuilder('c')
        .where('c.id = :id AND c.institucion_id = :institucion_id', { id, institucion_id: usuarioInstitucionId })
        .getExists();
      if (!pertenece) throw new NotFoundException(`Curso ${id} no encontrado`);
    }

    return curso;
  }

  async update(id: string, dto: Partial<CreateCursoDto>, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<Curso> {
    const curso = await this.findOne(id, usuarioRol, usuarioInstitucionId);
    // NUEVO: si no es ADMIN, no se permite reasignar el curso a otra
    // institución vía este endpoint.
    const dtoSeguro = usuarioRol === 'ADMIN' ? dto : { ...dto, institucion_id: undefined };
    Object.assign(curso, dtoSeguro);
    return this.cursoRepository.save(curso);
  }

  async remove(id: string, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<{ message: string }> {
    const curso = await this.findOne(id, usuarioRol, usuarioInstitucionId);
    curso.activo = false;
    await this.cursoRepository.save(curso);
    return { message: 'Curso desactivado correctamente' };
  }
}