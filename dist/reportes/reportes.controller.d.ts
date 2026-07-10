import { Response } from 'express';
import { ReportesService, PeriodoReporte } from './reportes.service';
export declare class ReportesController {
    private readonly reportesService;
    constructor(reportesService: ReportesService);
    reporteInstitucion(institucion_id: string, periodo: PeriodoReporte | undefined, res: Response): Promise<void>;
    reporteCurso(curso_id: string, periodo: PeriodoReporte | undefined, res: Response): Promise<void>;
}
