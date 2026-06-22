import { DataSource } from 'typeorm';
export declare class BackupService {
    private readonly dataSource;
    private readonly logger;
    private readonly backupDir;
    constructor(dataSource: DataSource);
    backupAutomatico(): Promise<void>;
    generarBackup(tipo?: 'manual' | 'automatico'): Promise<{
        mensaje: string;
        archivo: string;
        tablas: number;
        registros: number;
    }>;
    listarBackups(): Promise<{
        archivo: string;
        size: string;
        fecha: string;
    }[]>;
    private limpiarBackupsAntiguos;
}
