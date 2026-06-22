import { TipoTransaccion } from '../entities/historial-puntos.entity';
export declare class ModificarPuntosDto {
    estudiante_id: string;
    puntos: number;
    tipo: TipoTransaccion;
    descripcion?: string;
}
