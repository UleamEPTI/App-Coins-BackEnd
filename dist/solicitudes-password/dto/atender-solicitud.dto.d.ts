import { EstadoSolicitud } from '../entities/solicitud-password.entity';
export declare class AtenderSolicitudDto {
    nueva_password: string;
    estado: EstadoSolicitud;
    mensaje?: string;
}
