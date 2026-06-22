import { Repository } from 'typeorm';
import { Institucion } from './entities/institucion.entity';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class InstitucionesService {
    private readonly institucionRepository;
    private readonly auditoriaService;
    constructor(institucionRepository: Repository<Institucion>, auditoriaService: AuditoriaService);
    create(dto: CreateInstitucionDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Institucion>;
    findAll(): Promise<Institucion[]>;
    findOne(id: string): Promise<Institucion>;
    update(id: string, dto: Partial<CreateInstitucionDto>, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Institucion>;
    remove(id: string, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<{
        message: string;
    }>;
}
