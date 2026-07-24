import { SolicitudesPasswordService } from './solicitudes-password.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { AtenderSolicitudDto } from './dto/atender-solicitud.dto';
import { CambiarPasswordDirectoDto } from './dto/cambiar-password-directo.dto';
export declare class SolicitudesPasswordController {
    private readonly service;
    constructor(service: SolicitudesPasswordService);
    cambiarDirecto(usuario_id: string, dto: CambiarPasswordDirectoDto, req: any): Promise<{
        message: string;
    }>;
    solicitar(dto: CreateSolicitudDto, req: any): Promise<import("./entities/solicitud-password.entity").SolicitudPassword>;
    pendientes(): Promise<import("./entities/solicitud-password.entity").SolicitudPassword[]>;
    findAll(): Promise<import("./entities/solicitud-password.entity").SolicitudPassword[]>;
    atender(id: string, dto: AtenderSolicitudDto): Promise<{
        solicitud: import("./entities/solicitud-password.entity").SolicitudPassword;
        message: string;
    }>;
}
