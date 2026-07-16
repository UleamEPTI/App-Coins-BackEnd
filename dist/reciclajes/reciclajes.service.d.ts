import { Repository, DataSource } from 'typeorm';
import { Reciclaje } from './entities/reciclaje.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { HistorialPuntos } from '../puntos/entities/historial-puntos.entity';
import { CreateReciclajeDto } from './dto/create-reciclaje.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class ReciclajesService {
    private readonly reciclajeRepository;
    private readonly usuarioRepository;
    private readonly historialRepository;
    private readonly auditoriaService;
    private readonly dataSource;
    constructor(reciclajeRepository: Repository<Reciclaje>, usuarioRepository: Repository<Usuario>, historialRepository: Repository<HistorialPuntos>, auditoriaService: AuditoriaService, dataSource: DataSource);
    registrar(dto: CreateReciclajeDto, registradoPorId: string, ip?: string): Promise<Reciclaje>;
    findAll(): Promise<Reciclaje[]>;
    findByInstitucion(institucion_id: string): Promise<Reciclaje[]>;
    findByCurso(curso_id: string): Promise<Reciclaje[]>;
    findByRegistradoPor(registrado_por_id: string): Promise<Reciclaje[]>;
}
