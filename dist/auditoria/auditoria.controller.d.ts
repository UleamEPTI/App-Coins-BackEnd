import { AuditoriaService } from './auditoria.service';
export declare class AuditoriaController {
    private readonly auditoriaService;
    constructor(auditoriaService: AuditoriaService);
    findAll(): Promise<import("./entities/auditoria.entity").Auditoria[]>;
    findByTabla(tabla: string): Promise<import("./entities/auditoria.entity").Auditoria[]>;
    findByUsuario(usuario_id: string): Promise<import("./entities/auditoria.entity").Auditoria[]>;
    findByRegistro(tabla: string, registro_id: string): Promise<import("./entities/auditoria.entity").Auditoria[]>;
}
