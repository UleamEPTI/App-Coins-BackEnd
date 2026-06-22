import { Repository } from 'typeorm';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Canje } from '../canjes/entities/canje.entity';
export declare class ReportesService {
    private readonly estudianteRepository;
    private readonly reciclajeRepository;
    private readonly canjeRepository;
    constructor(estudianteRepository: Repository<Estudiante>, reciclajeRepository: Repository<Reciclaje>, canjeRepository: Repository<Canje>);
    generarReporteInstitucion(institucion_id: string): Promise<Buffer>;
    generarReporteCurso(curso_id: string): Promise<Buffer>;
    private generarPDF;
}
