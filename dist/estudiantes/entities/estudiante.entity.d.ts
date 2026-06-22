import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Curso } from './curso.entity';
export declare class Estudiante {
    id: string;
    usuario: Usuario;
    curso: Curso;
    codigo_estudiante: string;
    puntos: number;
    fecha_nacimiento: Date;
    direccion: string;
    activo: boolean;
    created_at: Date;
    updated_at: Date;
}
