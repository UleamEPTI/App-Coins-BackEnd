import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usuariosService;
    private jwtService;
    private readonly estudianteRepository;
    private readonly reciclajeRepository;
    constructor(usuariosService: UsuariosService, jwtService: JwtService, estudianteRepository: Repository<Estudiante>, reciclajeRepository: Repository<Reciclaje>);
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
    private buildProfilePayload;
    cambiarPasswordPropia(userId: string, passwordActual: string, passwordNueva: string): Promise<{
        message: string;
    }>;
}
