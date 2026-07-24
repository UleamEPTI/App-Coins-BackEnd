import { Repository } from 'typeorm';
import { SolicitudPassword } from './entities/solicitud-password.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { AtenderSolicitudDto } from './dto/atender-solicitud.dto';
export declare class SolicitudesPasswordService {
    private readonly solicitudRepository;
    private readonly usuarioRepository;
    constructor(solicitudRepository: Repository<SolicitudPassword>, usuarioRepository: Repository<Usuario>);
    cambiarPasswordDirecto(usuarioObjetivoId: string, nuevaPassword: string, solicitanteId: string, solicitanteRol?: string, solicitanteInstitucionId?: string | null): Promise<{
        message: string;
    }>;
    crearSolicitud(dto: CreateSolicitudDto, solicitanteId: string): Promise<SolicitudPassword>;
    findPendientes(): Promise<SolicitudPassword[]>;
    findAll(): Promise<SolicitudPassword[]>;
    atenderSolicitud(id: string, dto: AtenderSolicitudDto): Promise<{
        solicitud: SolicitudPassword;
        message: string;
    }>;
    private limpiarSolicitud;
}
