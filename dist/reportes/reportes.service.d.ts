import { Repository } from 'typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Institucion } from '../instituciones/entities/institucion.entity';
export type PeriodoReporte = 'semana' | 'mes' | 'anio';
export declare class ReportesService {
    private readonly cursoRepository;
    private readonly reciclajeRepository;
    private readonly institucionRepository;
    constructor(cursoRepository: Repository<Curso>, reciclajeRepository: Repository<Reciclaje>, institucionRepository: Repository<Institucion>);
    generarReporteInstitucion(institucion_id: string, periodo?: PeriodoReporte, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<Buffer>;
    generarReporteCurso(curso_id: string, periodo?: PeriodoReporte, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<Buffer>;
    private generarPDF;
}
