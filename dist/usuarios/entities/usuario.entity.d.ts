import { Rol } from './rol.entity';
export declare class Usuario {
    id: string;
    rol: Rol;
    nombres: string;
    apellidos: string;
    cedula: string;
    telefono: string;
    email: string;
    password_hash: string;
    foto_perfil: string;
    institucion_id: string;
    curso_id: string;
    activo: boolean;
    materia: string;
    debe_cambiar_password: boolean;
    created_at: Date;
    updated_at: Date;
}
