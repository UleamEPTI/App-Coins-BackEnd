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
const curso_entity_1 = require("../cursos/entities/curso.entity");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const historial_puntos_entity_1 = require("../puntos/entities/historial-puntos.entity");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const auditoria_entity_1 = require("../auditoria/entities/auditoria.entity");
const KILOS_A_MONEDAS = 1;
let ReciclajesService = class ReciclajesService {
    reciclajeRepository;
    cursoRepository;
    usuarioRepository;
    historialRepository;
    auditoriaService;
    dataSource;
    constructor(reciclajeRepository, cursoRepository, usuarioRepository, historialRepository, auditoriaService, dataSource) {
        this.reciclajeRepository = reciclajeRepository;
        this.cursoRepository = cursoRepository;
        this.usuarioRepository = usuarioRepository;
        this.historialRepository = historialRepository;
        this.auditoriaService = auditoriaService;
        this.dataSource = dataSource;
    }
    async registrar(dto, registradoPorId, ip) {
        const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
        if (!curso)
            throw new common_1.NotFoundException(`Curso ${dto.curso_id} no encontrado`);
        const registradoPor = await this.usuarioRepository.findOne({
            where: { id: registradoPorId },
            select: ['id', 'nombres', 'apellidos', 'email'],
        });
        if (!registradoPor)
            throw new common_1.NotFoundException(`Usuario ${registradoPorId} no encontrado`);
        const puntosGanados = dto.kilos * KILOS_A_MONEDAS;
        const saved = await this.dataSource.transaction(async (manager) => {
            curso.puntos += puntosGanados;
            await manager.save(curso);
            const historial = manager.create(historial_puntos_entity_1.HistorialPuntos, {
                curso,
                tipo: historial_puntos_entity_1.TipoTransaccion.SUMA,
                puntos: puntosGanados,
                descripcion: `Reciclaje: ${dto.kilos} kilo(s)`,
            });
            await manager.save(historial);
            const reciclaje = manager.create(reciclaje_entity_1.Reciclaje, {
                curso,
                registrado_por: registradoPor,
                kilos: dto.kilos,
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
                    curso_id: dto.curso_id,
                    kilos: dto.kilos,
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
            relations: ['curso', 'registrado_por'],
            order: { created_at: 'DESC' },
        });
    }
    async findByInstitucion(institucion_id) {
        return this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.curso', 'c')
            .leftJoinAndSelect('r.registrado_por', 'u')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .orderBy('r.created_at', 'DESC')
            .getMany();
    }
    async findByCurso(curso_id) {
        return this.reciclajeRepository.find({
            where: { curso: { id: curso_id } },
            relations: ['registrado_por'],
            order: { created_at: 'DESC' },
        });
    }
    async findByRegistradoPor(registrado_por_id) {
        return this.reciclajeRepository.find({
            where: { registrado_por: { id: registrado_por_id } },
            relations: ['curso'],
            order: { created_at: 'DESC' },
        });
    }
};
exports.ReciclajesService = ReciclajesService;
exports.ReciclajesService = ReciclajesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reciclaje_entity_1.Reciclaje)),
    __param(1, (0, typeorm_1.InjectRepository)(curso_entity_1.Curso)),
    __param(2, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(3, (0, typeorm_1.InjectRepository)(historial_puntos_entity_1.HistorialPuntos)),
    __param(5, (0, typeorm_2.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        auditoria_service_1.AuditoriaService,
        typeorm_3.DataSource])
], ReciclajesService);
//# sourceMappingURL=reciclajes.service.js.map