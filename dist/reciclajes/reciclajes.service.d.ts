import { Repository } from 'typeorm';
import { Reciclaje } from './entities/reciclaje.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { TipoBotella } from '../tipos-botella/entities/tipo-botella.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { HistorialPuntos } from '../puntos/entities/historial-puntos.entity';
import { CreateReciclajeDto } from './dto/create-reciclaje.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class ReciclajesService {
    private readonly reciclajeRepository;
    private readonly estudianteRepository;
    private readonly tipoBotellaRepository;
    private readonly usuarioRepository;
    private readonly historialRepository;
    private readonly auditoriaService;
    constructor(reciclajeRepository: Repository<Reciclaje>, estudianteRepository: Repository<Estudiante>, tipoBotellaRepository: Repository<TipoBotella>, usuarioRepository: Repository<Usuario>, historialRepository: Repository<HistorialPuntos>, auditoriaService: AuditoriaService);
    registrar(dto: CreateReciclajeDto, registradoPorId: string, ip?: string): Promise<Reciclaje>;
    findAll(): Promise<Reciclaje[]>;
    findByEstudiante(estudiante_id: string): Promise<Reciclaje[]>;
    findByInstitucion(institucion_id: string): Promise<Reciclaje[]>;
    findByCurso(curso_id: string): Promise<Reciclaje[]>;
}
