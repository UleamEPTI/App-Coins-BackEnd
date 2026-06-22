import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    findAll(): Promise<import("./entities/usuario.entity").Usuario[]>;
    getRoles(): Promise<import("./entities/rol.entity").Rol[]>;
    findOne(id: string): Promise<import("./entities/usuario.entity").Usuario>;
    create(dto: CreateUsuarioDto): Promise<{
        id: string;
        rol: import("./entities/rol.entity").Rol;
        nombres: string;
        apellidos: string;
        cedula: string;
        telefono: string;
        email: string;
        foto_perfil: string;
        institucion_id: string;
        curso_id: string;
        activo: boolean;
        materia: string;
        debe_cambiar_password: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    update(id: string, dto: Partial<CreateUsuarioDto>): Promise<{
        id: string;
        rol: import("./entities/rol.entity").Rol;
        nombres: string;
        apellidos: string;
        cedula: string;
        telefono: string;
        email: string;
        foto_perfil: string;
        institucion_id: string;
        curso_id: string;
        activo: boolean;
        materia: string;
        debe_cambiar_password: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
