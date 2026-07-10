import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare class Reciclaje {
    id: string;
    curso: Curso;
    registrado_por: Usuario;
    kilos: number;
    puntos_ganados: number;
    created_at: Date;
}
