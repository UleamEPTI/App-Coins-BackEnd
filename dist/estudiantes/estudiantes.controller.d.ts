import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
export declare class EstudiantesController {
    private readonly estudiantesService;
    constructor(estudiantesService: EstudiantesService);
    create(dto: CreateEstudianteDto): Promise<import("./entities/estudiante.entity").Estudiante>;
    findAll(search?: string, curso_id?: string, institucion_id?: string, activo?: string, page?: string, limit?: string, sort?: 'apellidos' | 'puntos' | 'created_at' | 'codigo_estudiante', order?: 'ASC' | 'DESC'): Promise<{
        data: import("./entities/estudiante.entity").Estudiante[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/estudiante.entity").Estudiante>;
    update(id: string, dto: Partial<CreateEstudianteDto>): Promise<import("./entities/estudiante.entity").Estudiante>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
