import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usuariosService;
    private jwtService;
    constructor(usuariosService: UsuariosService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        usuario: {
            id: any;
            nombres: any;
            apellidos: any;
            email: any;
            rol: any;
            activo: any;
            debe_cambiar_password: any;
            institucion_id: any;
            curso_id: any;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: any;
        nombres: any;
        apellidos: any;
        email: any;
        rol: any;
        activo: any;
        debe_cambiar_password: any;
        institucion_id: any;
        curso_id: any;
    }>;
    refreshToken(userId: string): Promise<{
        access_token: string;
        usuario: {
            id: any;
            nombres: any;
            apellidos: any;
            email: any;
            rol: any;
            activo: any;
            debe_cambiar_password: any;
            institucion_id: any;
            curso_id: any;
        };
    }>;
    private buildProfilePayload;
    cambiarPasswordPropia(userId: string, passwordActual: string, passwordNueva: string): Promise<{
        message: string;
    }>;
}
