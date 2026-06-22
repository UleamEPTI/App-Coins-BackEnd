import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
import { TipoBotella } from '../../tipos-botella/entities/tipo-botella.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare class Reciclaje {
    id: string;
    estudiante: Estudiante;
    tipo_botella: TipoBotella;
    registrado_por: Usuario;
    cantidad: number;
    puntos_ganados: number;
    created_at: Date;
}
