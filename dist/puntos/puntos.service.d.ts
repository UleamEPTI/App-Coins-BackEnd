import { Repository } from 'typeorm';
import { HistorialPuntos } from './entities/historial-puntos.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class PuntosService {
    private readonly historialRepository;
    private readonly cursoRepository;
    private readonly auditoriaService;
    constructor(historialRepository: Repository<HistorialPuntos>, cursoRepository: Repository<Curso>, auditoriaService: AuditoriaService);
    modificarPuntos(dto: ModificarPuntosDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<{
        curso: Curso;
        transaccion: HistorialPuntos;
    }>;
    getHistorial(curso_id: string): Promise<HistorialPuntos[]>;
}
