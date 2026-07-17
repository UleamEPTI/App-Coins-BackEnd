import { Repository } from 'typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Canje } from '../canjes/entities/canje.entity';
export declare class EstadisticasService {
    private readonly cursoRepository;
    private readonly reciclajeRepository;
    private readonly canjeRepository;
    constructor(cursoRepository: Repository<Curso>, reciclajeRepository: Repository<Reciclaje>, canjeRepository: Repository<Canje>);
    rankingInstitucion(institucion_id: string, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<Curso[]>;
    statsInstitucion(institucion_id: string, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<{
        totalCursos: number;
        totalKilos: number;
        totalPuntosGenerados: number;
        totalCanjes: number;
    }>;
    statsCurso(curso_id: string, usuarioRol?: string, usuarioInstitucionId?: string | null): Promise<{
        totalKilos: number;
        totalPuntosGenerados: number;
    }>;
}
