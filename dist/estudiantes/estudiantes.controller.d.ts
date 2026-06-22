import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
export declare class EstudiantesController {
    private readonly estudiantesService;
    constructor(estudiantesService: EstudiantesService);
    create(dto: CreateEstudianteDto): Promise<import("./entities/estudiante.entity").Estudiante>;
    findAll(): Promise<import("./entities/estudiante.entity").Estudiante[]>;
    findOne(id: string): Promise<import("./entities/estudiante.entity").Estudiante>;
    update(id: string, dto: Partial<CreateEstudianteDto>): Promise<import("./entities/estudiante.entity").Estudiante>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
