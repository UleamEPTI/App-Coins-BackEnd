import { Repository } from 'typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
export type PeriodoReporte = 'semana' | 'mes' | 'anio';
export declare class ReportesService {
    private readonly cursoRepository;
    private readonly reciclajeRepository;
    constructor(cursoRepository: Repository<Curso>, reciclajeRepository: Repository<Reciclaje>);
    generarReporteInstitucion(institucion_id: string, periodo?: PeriodoReporte): Promise<Buffer>;
    generarReporteCurso(curso_id: string, periodo?: PeriodoReporte): Promise<Buffer>;
    private generarPDF;
}
