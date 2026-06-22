import { Response } from 'express';
import { ReportesService } from './reportes.service';
export declare class ReportesController {
    private readonly reportesService;
    constructor(reportesService: ReportesService);
    reporteInstitucion(institucion_id: string, res: Response): Promise<void>;
    reporteCurso(curso_id: string, res: Response): Promise<void>;
}
