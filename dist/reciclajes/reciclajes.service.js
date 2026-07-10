"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReciclajesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const reciclaje_entity_1 = require("./entities/reciclaje.entity");
const estudiante_entity_1 = require("../estudiantes/entities/estudiante.entity");
const tipo_botella_entity_1 = require("../tipos-botella/entities/tipo-botella.entity");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const historial_puntos_entity_1 = require("../puntos/entities/historial-puntos.entity");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const auditoria_entity_1 = require("../auditoria/entities/auditoria.entity");
let ReciclajesService = class ReciclajesService {
    reciclajeRepository;
    estudianteRepository;
    tipoBotellaRepository;
    usuarioRepository;
    historialRepository;
    auditoriaService;
    dataSource;
    constructor(reciclajeRepository, estudianteRepository, tipoBotellaRepository, usuarioRepository, historialRepository, auditoriaService, dataSource) {
        this.reciclajeRepository = reciclajeRepository;
        this.estudianteRepository = estudianteRepository;
        this.tipoBotellaRepository = tipoBotellaRepository;
        this.usuarioRepository = usuarioRepository;
        this.historialRepository = historialRepository;
        this.auditoriaService = auditoriaService;
        this.dataSource = dataSource;
    }
    async registrar(dto, registradoPorId, ip) {
        const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
        if (!estudiante)
            throw new common_1.NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);
        const tipoBotella = await this.tipoBotellaRepository.findOne({ where: { id: dto.tipo_botella_id, activo: true } });
        if (!tipoBotella)
            throw new common_1.NotFoundException(`Tipo de botella ${dto.tipo_botella_id} no encontrado`);
        const registradoPor = await this.usuarioRepository.findOne({
            where: { id: registradoPorId },
            select: ['id', 'nombres', 'apellidos', 'email'],
        });
        if (!registradoPor)
            throw new common_1.NotFoundException(`Usuario ${registradoPorId} no encontrado`);
        const puntosGanados = tipoBotella.puntos * dto.cantidad;
        const saved = await this.dataSource.transaction(async (manager) => {
            estudiante.puntos += puntosGanados;
            await manager.save(estudiante);
            const historial = manager.create(historial_puntos_entity_1.HistorialPuntos, {
                estudiante,
                tipo: historial_puntos_entity_1.TipoTransaccion.SUMA,
                puntos: puntosGanados,
                descripcion: `Reciclaje: ${dto.cantidad} botella(s) de ${tipoBotella.tamano}`,
            });
            await manager.save(historial);
            const reciclaje = manager.create(reciclaje_entity_1.Reciclaje, {
                estudiante,
                tipo_botella: tipoBotella,
                registrado_por: registradoPor,
                cantidad: dto.cantidad,
                puntos_ganados: puntosGanados,
            });
            return manager.save(reciclaje);
        });
        try {
            await this.auditoriaService.registrar({
                tabla: 'reciclajes',
                accion: auditoria_entity_1.AccionAuditoria.CREATE,
                registro_id: saved.id,
                datos_nuevos: {
                    estudiante_id: dto.estudiante_id,
                    tipo_botella: tipoBotella.tamano,
                    cantidad: dto.cantidad,
                    puntos_ganados: puntosGanados,
                },
                usuario_id: registradoPorId,
                usuario_email: registradoPor.email,
                ip,
            });
        }
        catch (err) {
            console.error('Error al registrar auditoría:', err);
        }
        return saved;
    }
    async findAll() {
        return this.reciclajeRepository.find({
            relations: ['estudiante', 'tipo_botella', 'registrado_por'],
            order: { created_at: 'DESC' },
        });
    }
    async findByEstudiante(estudiante_id) {
        return this.reciclajeRepository.find({
            where: { estudiante: { id: estudiante_id } },
            relations: ['tipo_botella'],
            order: { created_at: 'DESC' },
        });
    }
    async findByInstitucion(institucion_id) {
        return this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.estudiante', 'e')
            .leftJoinAndSelect('r.tipo_botella', 'tb')
            .leftJoinAndSelect('r.registrado_por', 'u')
            .leftJoinAndSelect('e.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .orderBy('r.created_at', 'DESC')
            .getMany();
    }
    async findByCurso(curso_id) {
        return this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.estudiante', 'e')
            .leftJoinAndSelect('r.tipo_botella', 'tb')
            .leftJoinAndSelect('e.curso', 'c')
            .where('e.curso_id = :curso_id', { curso_id })
            .orderBy('r.created_at', 'DESC')
            .getMany();
    }
    async findByRegistradoPor(registrado_por_id) {
        return this.reciclajeRepository.find({
            where: { registrado_por: { id: registrado_por_id } },
            relations: ['estudiante', 'tipo_botella'],
            order: { created_at: 'DESC' },
        });
    }
};
exports.ReciclajesService = ReciclajesService;
exports.ReciclajesService = ReciclajesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reciclaje_entity_1.Reciclaje)),
    __param(1, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __param(2, (0, typeorm_1.InjectRepository)(tipo_botella_entity_1.TipoBotella)),
    __param(3, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(4, (0, typeorm_1.InjectRepository)(historial_puntos_entity_1.HistorialPuntos)),
    __param(6, (0, typeorm_2.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        auditoria_service_1.AuditoriaService,
        typeorm_3.DataSource])
], ReciclajesService);
//# sourceMappingURL=reciclajes.service.js.map