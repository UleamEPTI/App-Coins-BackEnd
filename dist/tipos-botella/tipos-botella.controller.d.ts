import { TiposBotellaService } from './tipos-botella.service';
import { CreateTipoBotellaDto } from './dto/create-tipo-botella.dto';
export declare class TiposBotellaController {
    private readonly tiposBotellaService;
    constructor(tiposBotellaService: TiposBotellaService);
    create(dto: CreateTipoBotellaDto): Promise<import("./entities/tipo-botella.entity").TipoBotella>;
    findAll(): Promise<import("./entities/tipo-botella.entity").TipoBotella[]>;
    findOne(id: string): Promise<import("./entities/tipo-botella.entity").TipoBotella>;
    update(id: string, dto: Partial<CreateTipoBotellaDto>): Promise<import("./entities/tipo-botella.entity").TipoBotella>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
