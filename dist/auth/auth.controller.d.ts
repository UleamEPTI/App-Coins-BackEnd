import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
        id: string;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
        activo: boolean;
        debe_cambiar_password: boolean;
    }>;
    refresh(req: any): Promise<{
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
    cambiarPassword(req: any, passwordActual: string, passwordNueva: string): Promise<{
        message: string;
    }>;
}
