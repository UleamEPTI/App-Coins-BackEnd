import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
export declare enum TipoTransaccion {
    SUMA = "SUMA",
    RESTA = "RESTA",
    CANJE = "CANJE"
}
export declare class HistorialPuntos {
    id: string;
    estudiante: Estudiante;
    tipo: TipoTransaccion;
    puntos: number;
    descripcion: string;
    created_at: Date;
}
