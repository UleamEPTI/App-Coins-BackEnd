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
exports.CanjesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const canje_entity_1 = require("./entities/canje.entity");
const curso_entity_1 = require("../cursos/entities/curso.entity");
const premio_entity_1 = require("../premios/entities/premio.entity");
const historial_puntos_entity_1 = require("../puntos/entities/historial-puntos.entity");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const auditoria_entity_1 = require("../auditoria/entities/auditoria.entity");
let CanjesService = class CanjesService {
    canjeRepository;
    cursoRepository;
    premioRepository;
    historialRepository;
    auditoriaService;
    dataSource;
    constructor(canjeRepository, cursoRepository, premioRepository, historialRepository, auditoriaService, dataSource) {
        this.canjeRepository = canjeRepository;
        this.cursoRepository = cursoRepository;
        this.premioRepository = premioRepository;
        this.historialRepository = historialRepository;
        this.auditoriaService = auditoriaService;
        this.dataSource = dataSource;
    }
    async canjear(dto, usuarioId, usuarioEmail, usuarioRol, usuarioInstitucionId, ip) {
        const saved = await this.dataSource.transaction(async (manager) => {
            const cursoQuery = manager
                .createQueryBuilder(curso_entity_1.Curso, 'c')
                .where('c.id = :id', { id: dto.curso_id })
                .setLock('pessimistic_write');
            if (usuarioRol !== 'ADMIN') {
                cursoQuery.andWhere('c.institucion_id = :institucion_id', { institucion_id: usuarioInstitucionId });
            }
            const curso = await cursoQuery.getOne();
            if (!curso)
                throw new common_1.NotFoundException(`Curso ${dto.curso_id} no encontrado`);
            const premio = await manager.findOne(premio_entity_1.Premio, {
                where: { id: dto.premio_id, activo: true },
                lock: { mode: 'pessimistic_write' },
            });
            if (!premio)
                throw new common_1.NotFoundException(`Premio ${dto.premio_id} no encontrado o inactivo`);
            if (premio.stock <= 0)
                throw new common_1.BadRequestException('El premio no tiene stock disponible');
            if (curso.puntos < premio.costo_puntos) {
                throw new common_1.BadRequestException(`Puntos insuficientes. Tiene ${curso.puntos}, necesita ${premio.costo_puntos}`);
            }
            curso.puntos -= premio.costo_puntos;
            premio.stock -= 1;
            await manager.save(curso);
            await manager.save(premio);
            const historial = manager.create(historial_puntos_entity_1.HistorialPuntos, {
                curso,
                tipo: historial_puntos_entity_1.TipoTransaccion.CANJE,
                puntos: premio.costo_puntos,
                descripcion: `Canje por premio: ${premio.nombre}`,
            });
            await manager.save(historial);
            const canje = manager.create(canje_entity_1.Canje, {
                curso,
                premio,
                puntos_gastados: premio.costo_puntos,
                estado: canje_entity_1.EstadoCanje.PENDIENTE,
            });
            const savedCanje = await manager.save(canje);
            return { savedCanje, premioNombre: premio.nombre };
        });
        try {
            await this.auditoriaService.registrar({
                tabla: 'canjes',
                accion: auditoria_entity_1.AccionAuditoria.CREATE,
                registro_id: saved.savedCanje.id,
                datos_nuevos: {
                    curso_id: dto.curso_id,
                    premio: saved.premioNombre,
                    puntos_gastados: saved.savedCanje.puntos_gastados,
                    estado: canje_entity_1.EstadoCanje.PENDIENTE,
                },
                usuario_id: usuarioId,
                usuario_email: usuarioEmail,
                ip,
            });
        }
        catch (err) {
            console.error('Error al registrar auditoría:', err);
        }
        return saved.savedCanje;
    }
    async findAll() {
        return this.canjeRepository.find({
            relations: ['curso', 'premio'],
            order: { created_at: 'DESC' },
        });
    }
    async findByCurso(curso_id, usuarioRol, usuarioInstitucionId) {
        if (usuarioRol && usuarioRol !== 'ADMIN') {
            const pertenece = await this.dataSource
                .createQueryBuilder(curso_entity_1.Curso, 'c')
                .where('c.id = :curso_id AND c.institucion_id = :institucion_id', { curso_id, institucion_id: usuarioInstitucionId })
                .getExists();
            if (!pertenece)
                throw new common_1.NotFoundException(`Curso ${curso_id} no encontrado`);
        }
        return this.canjeRepository.find({
            where: { curso: { id: curso_id } },
            relations: ['premio'],
            order: { created_at: 'DESC' },
        });
    }
    async actualizarEstado(id, estado, usuarioId, usuarioEmail, ip) {
        const { saved, estadoAnterior } = await this.dataSource.transaction(async (manager) => {
            const canje = await manager.findOne(canje_entity_1.Canje, {
                where: { id },
                relations: ['curso', 'premio'],
                lock: { mode: 'pessimistic_write' },
            });
            if (!canje)
                throw new common_1.NotFoundException(`Canje ${id} no encontrado`);
            const estadoAnterior = canje.estado;
            if (estado === canje_entity_1.EstadoCanje.CANCELADO) {
                if (estadoAnterior === canje_entity_1.EstadoCanje.CANCELADO) {
                    throw new common_1.BadRequestException('Este canje ya está cancelado');
                }
                const curso = await manager.findOne(curso_entity_1.Curso, {
                    where: { id: canje.curso.id },
                    lock: { mode: 'pessimistic_write' },
                });
                if (curso) {
                    curso.puntos += canje.puntos_gastados;
                    await manager.save(curso);
                    await manager.save(manager.create(historial_puntos_entity_1.HistorialPuntos, {
                        curso,
                        tipo: historial_puntos_entity_1.TipoTransaccion.SUMA,
                        puntos: canje.puntos_gastados,
                        descripcion: `Reverso por cancelación de canje: ${canje.premio?.nombre ?? ''}`,
                    }));
                }
                const premio = await manager.findOne(premio_entity_1.Premio, {
                    where: { id: canje.premio.id },
                    lock: { mode: 'pessimistic_write' },
                });
                if (premio) {
                    premio.stock += 1;
                    await manager.save(premio);
                }
            }
            canje.estado = estado;
            const saved = await manager.save(canje);
            return { saved, estadoAnterior };
        });
        try {
            await this.auditoriaService.registrar({
                tabla: 'canjes',
                accion: auditoria_entity_1.AccionAuditoria.UPDATE,
                registro_id: id,
                datos_anteriores: { estado: estadoAnterior },
                datos_nuevos: { estado },
                usuario_id: usuarioId,
                usuario_email: usuarioEmail,
                ip,
            });
        }
        catch (err) {
            console.error('Error al registrar auditoría:', err);
        }
        return saved;
    }
};
exports.CanjesService = CanjesService;
exports.CanjesService = CanjesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(canje_entity_1.Canje)),
    __param(1, (0, typeorm_1.InjectRepository)(curso_entity_1.Curso)),
    __param(2, (0, typeorm_1.InjectRepository)(premio_entity_1.Premio)),
    __param(3, (0, typeorm_1.InjectRepository)(historial_puntos_entity_1.HistorialPuntos)),
    __param(5, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auditoria_service_1.AuditoriaService,
        typeorm_2.DataSource])
], CanjesService);
//# sourceMappingURL=canjes.service.js.map