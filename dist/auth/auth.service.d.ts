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
            id: string;
            nombres: string;
            apellidos: string;
            email: string;
            rol: string;
            debe_cambiar_password: boolean;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        activo: boolean;
        debe_cambiar_password: boolean;
    }>;
    refreshToken(userId: string): Promise<{
        access_token: string;
        usuario: {
            id: string;
            nombres: string;
            apellidos: string;
            email: string;
            rol: string;
            debe_cambiar_password: boolean;
        };
    }>;
    cambiarPasswordPropia(userId: string, passwordActual: string, passwordNueva: string): Promise<{
        message: string;
    }>;
}
