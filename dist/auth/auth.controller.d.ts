import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
        } | {
            id: string;
            codigo_estudiante: string;
            puntos: number;
            totalBottles: number;
            curso: {
                id: string;
                nombre: string;
                institucion_id: string;
            };
            curso_id: any;
            institucion_id: any;
            nombres: any;
            apellidos: any;
            email: any;
            rol: any;
            activo: any;
            debe_cambiar_password: any;
        };
    }>;
    getProfile(req: any): Promise<{
        id: any;
        nombres: any;
        apellidos: any;
        email: any;
        rol: any;
        activo: any;
        debe_cambiar_password: any;
        institucion_id: any;
        curso_id: any;
    } | {
        id: string;
        codigo_estudiante: string;
        puntos: number;
        totalBottles: number;
        curso: {
            id: string;
            nombre: string;
            institucion_id: string;
        };
        curso_id: any;
        institucion_id: any;
        nombres: any;
        apellidos: any;
        email: any;
        rol: any;
        activo: any;
        debe_cambiar_password: any;
    }>;
    refresh(req: any): Promise<{
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
        } | {
            id: string;
            codigo_estudiante: string;
            puntos: number;
            totalBottles: number;
            curso: {
                id: string;
                nombre: string;
                institucion_id: string;
            };
            curso_id: any;
            institucion_id: any;
            nombres: any;
            apellidos: any;
            email: any;
            rol: any;
            activo: any;
            debe_cambiar_password: any;
        };
    }>;
    cambiarPassword(req: any, passwordActual: string, passwordNueva: string): Promise<{
        message: string;
    }>;
}
