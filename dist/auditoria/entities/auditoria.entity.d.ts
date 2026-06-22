export declare enum AccionAuditoria {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export declare class Auditoria {
    id: string;
    tabla: string;
    accion: AccionAuditoria;
    registro_id: string;
    datos_anteriores: object;
    datos_nuevos: object;
    usuario_id: string;
    usuario_email: string;
    ip: string;
    created_at: Date;
}
