import { Repository } from 'typeorm';
import { Auditoria, AccionAuditoria } from './entities/auditoria.entity';
export interface AuditoriaPayload {
    tabla: string;
    accion: AccionAuditoria;
    registro_id: string;
    datos_anteriores?: object;
    datos_nuevos?: object;
    usuario_id?: string;
    usuario_email?: string;
    ip?: string;
}
export declare class AuditoriaService {
    private readonly auditoriaRepository;
    constructor(auditoriaRepository: Repository<Auditoria>);
    registrar(payload: AuditoriaPayload): Promise<void>;
    findAll(): Promise<Auditoria[]>;
    findByTabla(tabla: string): Promise<Auditoria[]>;
    findByUsuario(usuario_id: string): Promise<Auditoria[]>;
    findByRegistro(tabla: string, registro_id: string): Promise<Auditoria[]>;
}
