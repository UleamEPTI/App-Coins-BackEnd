import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
import { Premio } from '../../premios/entities/premio.entity';
export declare enum EstadoCanje {
    PENDIENTE = "PENDIENTE",
    ENTREGADO = "ENTREGADO",
    CANCELADO = "CANCELADO"
}
export declare class Canje {
    id: string;
    estudiante: Estudiante;
    premio: Premio;
    puntos_gastados: number;
    estado: EstadoCanje;
    created_at: Date;
}
