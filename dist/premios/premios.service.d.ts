import { Repository } from 'typeorm';
import { Premio } from './entities/premio.entity';
import { CreatePremioDto } from './dto/create-premio.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class PremiosService {
    private readonly premioRepository;
    private readonly auditoriaService;
    constructor(premioRepository: Repository<Premio>, auditoriaService: AuditoriaService);
    create(dto: CreatePremioDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Premio>;
    findAll(): Promise<Premio[]>;
    findOne(id: string): Promise<Premio>;
    update(id: string, dto: Partial<CreatePremioDto>, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Premio>;
    remove(id: string, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<{
        message: string;
    }>;
}
