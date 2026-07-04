import { InstitucionesService } from './instituciones.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
export declare class InstitucionesController {
    private readonly institucionesService;
    constructor(institucionesService: InstitucionesService);
    create(dto: CreateInstitucionDto, req: any): Promise<import("./entities/institucion.entity").Institucion>;
    findAll(search?: string, activo?: string, page?: string, limit?: string, sort?: 'nombre' | 'created_at' | 'codigo', order?: 'ASC' | 'DESC'): Promise<{
        data: import("./entities/institucion.entity").Institucion[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/institucion.entity").Institucion>;
    update(id: string, dto: Partial<CreateInstitucionDto>, req: any): Promise<import("./entities/institucion.entity").Institucion>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
