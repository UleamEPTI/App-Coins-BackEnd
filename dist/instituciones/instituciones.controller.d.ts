import { InstitucionesService } from './instituciones.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
export declare class InstitucionesController {
    private readonly institucionesService;
    constructor(institucionesService: InstitucionesService);
    create(dto: CreateInstitucionDto, req: any): Promise<import("./entities/institucion.entity").Institucion>;
    findAll(): Promise<import("./entities/institucion.entity").Institucion[]>;
    findOne(id: string): Promise<import("./entities/institucion.entity").Institucion>;
    update(id: string, dto: Partial<CreateInstitucionDto>, req: any): Promise<import("./entities/institucion.entity").Institucion>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
