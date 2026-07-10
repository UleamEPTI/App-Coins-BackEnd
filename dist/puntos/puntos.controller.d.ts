import { PuntosService } from './puntos.service';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';
export declare class PuntosController {
    private readonly puntosService;
    constructor(puntosService: PuntosService);
    modificar(dto: ModificarPuntosDto, req: any): Promise<{
        curso: import("../cursos/entities/curso.entity").Curso;
        transaccion: import("./entities/historial-puntos.entity").HistorialPuntos;
    }>;
    historial(curso_id: string): Promise<import("./entities/historial-puntos.entity").HistorialPuntos[]>;
}
