import { PuntosService } from './puntos.service';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';
export declare class PuntosController {
    private readonly puntosService;
    constructor(puntosService: PuntosService);
    modificar(dto: ModificarPuntosDto, req: any): Promise<{
        estudiante: import("../estudiantes/entities/estudiante.entity").Estudiante;
        transaccion: import("./entities/historial-puntos.entity").HistorialPuntos;
    }>;
    historial(estudiante_id: string): Promise<import("./entities/historial-puntos.entity").HistorialPuntos[]>;
}
