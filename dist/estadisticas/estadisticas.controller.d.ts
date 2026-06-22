import { EstadisticasService } from './estadisticas.service';
export declare class EstadisticasController {
    private readonly estadisticasService;
    constructor(estadisticasService: EstadisticasService);
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
    rankingInstitucion(institucion_id: string): Promise<import("../estudiantes/entities/estudiante.entity").Estudiante[]>;
    rankingCurso(curso_id: string): Promise<import("../estudiantes/entities/estudiante.entity").Estudiante[]>;
}
