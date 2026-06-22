import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare enum EstadoSolicitud {
    PENDIENTE = "PENDIENTE",
    ATENDIDA = "ATENDIDA",
    RECHAZADA = "RECHAZADA"
}
export declare class SolicitudPassword {
    id: string;
    solicitado_por: Usuario;
    usuario_objetivo: Usuario;
    estado: string;
    mensaje: string;
    created_at: Date;
    updated_at: Date;
}
