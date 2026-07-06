import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
export interface FiltrosEstudiante {
    search?: string;
    curso_id?: string;
    institucion_id?: string;
    activo?: boolean;
    page?: number;
    limit?: number;
    sort?: 'apellidos' | 'puntos' | 'created_at' | 'codigo_estudiante';
    order?: 'ASC' | 'DESC';
}
export declare class EstudiantesService {
    private readonly estudianteRepository;
    private readonly cursoRepository;
    private readonly usuarioRepository;
    constructor(estudianteRepository: Repository<Estudiante>, cursoRepository: Repository<Curso>, usuarioRepository: Repository<Usuario>);
    create(dto: CreateEstudianteDto): Promise<Estudiante>;
    findAll(filtros?: FiltrosEstudiante): Promise<{
        data: Estudiante[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Estudiante>;
    update(id: string, dto: Partial<CreateEstudianteDto>): Promise<Estudiante>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
