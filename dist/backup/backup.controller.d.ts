import { BackupService } from './backup.service';
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    generarManual(): Promise<{
        mensaje: string;
        archivo: string;
        tablas: number;
        registros: number;
    }>;
    listar(): Promise<{
        archivo: string;
        size: string;
        fecha: string;
    }[]>;
}
