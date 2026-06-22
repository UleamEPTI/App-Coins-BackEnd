import { Repository } from 'typeorm';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Canje } from '../canjes/entities/canje.entity';
export declare class EstadisticasService {
    private readonly estudianteRepository;
    private readonly reciclajeRepository;
    private readonly canjeRepository;
    constructor(estudianteRepository: Repository<Estudiante>, reciclajeRepository: Repository<Reciclaje>, canjeRepository: Repository<Canje>);
    rankingCurso(curso_id: string): Promise<Estudiante[]>;
    rankingInstitucion(institucion_id: string): Promise<Estudiante[]>;
    statsInstitucion(institucion_id: string): Promise<{
        totalEstudiantes: number;
        totalBotellas: number;
        totalPuntosGenerados: number;
        totalCanjes: number;
        botellaPorTipo: Record<string, number>;
    }>;
    statsCurso(curso_id: string): Promise<{
        totalEstudiantes: number;
        totalBotellas: number;
        totalPuntosGenerados: number;
        botellaPorTipo: Record<string, number>;
    }>;
}
