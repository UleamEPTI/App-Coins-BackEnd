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
exports.PremiosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const premio_entity_1 = require("./entities/premio.entity");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const auditoria_entity_1 = require("../auditoria/entities/auditoria.entity");
let PremiosService = class PremiosService {
    premioRepository;
    auditoriaService;
    constructor(premioRepository, auditoriaService) {
        this.premioRepository = premioRepository;
        this.auditoriaService = auditoriaService;
    }
    async create(dto, usuarioId, usuarioEmail, ip) {
        const premio = this.premioRepository.create(dto);
        const saved = await this.premioRepository.save(premio);
        await this.auditoriaService.registrar({
            tabla: 'premios',
            accion: auditoria_entity_1.AccionAuditoria.CREATE,
            registro_id: saved.id,
            datos_nuevos: { nombre: dto.nombre, costo_puntos: dto.costo_puntos, stock: dto.stock },
            usuario_id: usuarioId,
            usuario_email: usuarioEmail,
            ip,
        });
        return saved;
    }
    async findAll() {
        return this.premioRepository.find({ where: { activo: true } });
    }
    async findOne(id) {
        const premio = await this.premioRepository.findOne({ where: { id } });
        if (!premio)
            throw new common_1.NotFoundException(`Premio ${id} no encontrado`);
        return premio;
    }
    async update(id, dto, usuarioId, usuarioEmail, ip) {
        const premio = await this.findOne(id);
        const anterior = { nombre: premio.nombre, costo_puntos: premio.costo_puntos, stock: premio.stock };
        Object.assign(premio, dto);
        const saved = await this.premioRepository.save(premio);
        await this.auditoriaService.registrar({
            tabla: 'premios',
            accion: auditoria_entity_1.AccionAuditoria.UPDATE,
            registro_id: id,
            datos_anteriores: anterior,
            datos_nuevos: dto,
            usuario_id: usuarioId,
            usuario_email: usuarioEmail,
            ip,
        });
        return saved;
    }
    async remove(id, usuarioId, usuarioEmail, ip) {
        const premio = await this.findOne(id);
        premio.activo = false;
        await this.premioRepository.save(premio);
        await this.auditoriaService.registrar({
            tabla: 'premios',
            accion: auditoria_entity_1.AccionAuditoria.DELETE,
            registro_id: id,
            datos_anteriores: { nombre: premio.nombre, activo: true },
            datos_nuevos: { activo: false },
            usuario_id: usuarioId,
            usuario_email: usuarioEmail,
            ip,
        });
        return { message: `Premio ${id} desactivado correctamente` };
    }
};
exports.PremiosService = PremiosService;
exports.PremiosService = PremiosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(premio_entity_1.Premio)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auditoria_service_1.AuditoriaService])
], PremiosService);
//# sourceMappingURL=premios.service.js.map