import { ReciclajesService } from './reciclajes.service';
import { CreateReciclajeDto } from './dto/create-reciclaje.dto';
export declare class ReciclajesController {
    private readonly reciclajesService;
    constructor(reciclajesService: ReciclajesService);
    registrar(dto: CreateReciclajeDto, req: any): Promise<import("./entities/reciclaje.entity").Reciclaje>;
    findAll(): Promise<import("./entities/reciclaje.entity").Reciclaje[]>;
    findByInstitucion(institucion_id: string, req: any): Promise<import("./entities/reciclaje.entity").Reciclaje[]>;
    findByCurso(curso_id: string, req: any): Promise<import("./entities/reciclaje.entity").Reciclaje[]>;
    findByRegistradoPor(registrado_por_id: string): Promise<import("./entities/reciclaje.entity").Reciclaje[]>;
}
