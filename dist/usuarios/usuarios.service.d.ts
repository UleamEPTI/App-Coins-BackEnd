import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
export declare class UsuariosService {
    private usuarioRepository;
    private rolRepository;
    constructor(usuarioRepository: Repository<Usuario>, rolRepository: Repository<Rol>);
    findAll(): Promise<Usuario[]>;
    findOne(id: string): Promise<Usuario>;
    findByEmail(email: string): Promise<Usuario | null>;
    findById(id: string): Promise<Usuario | null>;
    findByInstitucion(institucion_id: string): Promise<Usuario[]>;
    create(dto: CreateUsuarioDto): Promise<{
        id: string;
        rol: Rol;
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
        rol: Rol;
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
    save(usuario: Usuario): Promise<Usuario>;
    getRoles(): Promise<Rol[]>;
}
