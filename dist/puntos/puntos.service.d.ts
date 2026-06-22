import { Repository } from 'typeorm';
import { HistorialPuntos } from './entities/historial-puntos.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class PuntosService {
    private readonly historialRepository;
    private readonly estudianteRepository;
    private readonly auditoriaService;
    constructor(historialRepository: Repository<HistorialPuntos>, estudianteRepository: Repository<Estudiante>, auditoriaService: AuditoriaService);
    modificarPuntos(dto: ModificarPuntosDto, usuarioId?: string, usuarioEmail?: string, ip?: string): Promise<{
        estudiante: Estudiante;
        transaccion: HistorialPuntos;
    }>;
    getHistorial(estudiante_id: string): Promise<HistorialPuntos[]>;
}
