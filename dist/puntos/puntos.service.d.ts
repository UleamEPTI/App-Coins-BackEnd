import { Repository, DataSource } from 'typeorm';
import { HistorialPuntos } from './entities/historial-puntos.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class PuntosService {
    private readonly historialRepository;
    private readonly cursoRepository;
    private readonly auditoriaService;
    private readonly dataSource;
    constructor(historialRepository: Repository<HistorialPuntos>, cursoRepository: Repository<Curso>, auditoriaService: AuditoriaService, dataSource: DataSource);
    modificarPuntos(dto: ModificarPuntosDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<{
        curso: Curso;
        transaccion: HistorialPuntos;
    }>;
    getHistorial(curso_id: string): Promise<HistorialPuntos[]>;
}
