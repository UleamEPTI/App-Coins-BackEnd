import { EstadisticasService } from './estadisticas.service';
export declare class EstadisticasController {
    private readonly estadisticasService;
    constructor(estadisticasService: EstadisticasService);
    statsInstitucion(institucion_id: string): Promise<{
        totalCursos: number;
        totalKilos: number;
        totalPuntosGenerados: number;
        totalCanjes: number;
    }>;
    statsCurso(curso_id: string): Promise<{
        totalKilos: number;
        totalPuntosGenerados: number;
    }>;
    rankingInstitucion(institucion_id: string): Promise<import("../cursos/entities/curso.entity").Curso[]>;
}
