import { Curso } from '../../cursos/entities/curso.entity';
export declare enum TipoTransaccion {
    SUMA = "SUMA",
    RESTA = "RESTA",
    CANJE = "CANJE"
}
export declare class HistorialPuntos {
    id: string;
    curso: Curso;
    tipo: TipoTransaccion;
    puntos: number;
    descripcion: string;
    created_at: Date;
}
