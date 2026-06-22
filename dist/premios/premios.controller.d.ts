import { PremiosService } from './premios.service';
import { CreatePremioDto } from './dto/create-premio.dto';
export declare class PremiosController {
    private readonly premiosService;
    constructor(premiosService: PremiosService);
    create(dto: CreatePremioDto, req: any): Promise<import("./entities/premio.entity").Premio>;
    findAll(): Promise<import("./entities/premio.entity").Premio[]>;
    findOne(id: string): Promise<import("./entities/premio.entity").Premio>;
    update(id: string, dto: Partial<CreatePremioDto>, req: any): Promise<import("./entities/premio.entity").Premio>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
