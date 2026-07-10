import { Repository, DataSource } from 'typeorm';
import { Canje, EstadoCanje } from './entities/canje.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Premio } from '../premios/entities/premio.entity';
import { HistorialPuntos } from '../puntos/entities/historial-puntos.entity';
import { CreateCanjeDto } from './dto/create-canje.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class CanjesService {
    private readonly canjeRepository;
    private readonly cursoRepository;
    private readonly premioRepository;
    private readonly historialRepository;
    private readonly auditoriaService;
    private readonly dataSource;
    constructor(canjeRepository: Repository<Canje>, cursoRepository: Repository<Curso>, premioRepository: Repository<Premio>, historialRepository: Repository<HistorialPuntos>, auditoriaService: AuditoriaService, dataSource: DataSource);
    canjear(dto: CreateCanjeDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Canje>;
    findAll(): Promise<Canje[]>;
    findByCurso(curso_id: string): Promise<Canje[]>;
    actualizarEstado(id: string, estado: EstadoCanje, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<Canje>;
}
