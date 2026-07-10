import { Curso } from '../../cursos/entities/curso.entity';
import { Premio } from '../../premios/entities/premio.entity';
export declare enum EstadoCanje {
    PENDIENTE = "PENDIENTE",
    ENTREGADO = "ENTREGADO",
    CANCELADO = "CANCELADO"
}
export declare class Canje {
    id: string;
    curso: Curso;
    premio: Premio;
    puntos_gastados: number;
    estado: EstadoCanje;
    created_at: Date;
}
