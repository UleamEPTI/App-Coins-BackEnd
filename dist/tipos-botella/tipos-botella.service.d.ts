import { Repository } from 'typeorm';
import { TipoBotella } from './entities/tipo-botella.entity';
import { CreateTipoBotellaDto } from './dto/create-tipo-botella.dto';
export declare class TiposBotellaService {
    private readonly tipoBotellaRepository;
    constructor(tipoBotellaRepository: Repository<TipoBotella>);
    create(dto: CreateTipoBotellaDto): Promise<TipoBotella>;
    findAll(): Promise<TipoBotella[]>;
    findByInstitucion(institucion_id: string): Promise<TipoBotella[]>;
    findOne(id: string): Promise<TipoBotella>;
    update(id: string, dto: Partial<CreateTipoBotellaDto>): Promise<TipoBotella>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
