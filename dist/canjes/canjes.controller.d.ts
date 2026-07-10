import { CanjesService } from './canjes.service';
import { CreateCanjeDto } from './dto/create-canje.dto';
import { EstadoCanje } from './entities/canje.entity';
export declare class CanjesController {
    private readonly canjesService;
    constructor(canjesService: CanjesService);
    canjear(dto: CreateCanjeDto, req: any): Promise<import("./entities/canje.entity").Canje>;
    findAll(): Promise<import("./entities/canje.entity").Canje[]>;
    findByCurso(curso_id: string): Promise<import("./entities/canje.entity").Canje[]>;
    actualizarEstado(id: string, estado: EstadoCanje, req: any): Promise<import("./entities/canje.entity").Canje>;
}
