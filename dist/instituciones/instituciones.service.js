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
exports.InstitucionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const institucion_entity_1 = require("./entities/institucion.entity");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const auditoria_entity_1 = require("../auditoria/entities/auditoria.entity");
let InstitucionesService = class InstitucionesService {
    institucionRepository;
    auditoriaService;
    constructor(institucionRepository, auditoriaService) {
        this.institucionRepository = institucionRepository;
        this.auditoriaService = auditoriaService;
    }
    async create(dto, usuarioId, usuarioEmail, ip) {
        const existe = await this.institucionRepository.findOne({ where: { codigo: dto.codigo } });
        if (existe)
            throw new common_1.ConflictException('Ya existe una institución con ese código');
        const institucion = this.institucionRepository.create(dto);
        const saved = await this.institucionRepository.save(institucion);
        await this.auditoriaService.registrar({
            tabla: 'instituciones',
            accion: auditoria_entity_1.AccionAuditoria.CREATE,
            registro_id: saved.id,
            datos_nuevos: { nombre: dto.nombre, codigo: dto.codigo },
            usuario_id: usuarioId,
            usuario_email: usuarioEmail,
            ip,
        });
        return saved;
    }
    async findAll(filtros = {}) {
        const { search, activo, page = 1, limit = 20, sort = 'nombre', order = 'ASC', } = filtros;
        const query = this.institucionRepository.createQueryBuilder('i');
        if (search) {
            query.andWhere('(LOWER(i.nombre) LIKE :search OR LOWER(i.codigo) LIKE :search OR LOWER(i.dominio) LIKE :search)', { search: `%${search.toLowerCase()}%` });
        }
        if (activo !== undefined) {
            query.andWhere('i.activo = :activo', { activo });
        }
        else {
            query.andWhere('i.activo = true');
        }
        const total = await query.getCount();
        query
            .orderBy(`i.${sort}`, order)
            .skip((page - 1) * limit)
            .take(limit);
        const data = await query.getMany();
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const inst = await this.institucionRepository.findOne({ where: { id } });
        if (!inst)
            throw new common_1.NotFoundException(`Institución ${id} no encontrada`);
        return inst;
    }
    async update(id, dto, usuarioId, usuarioEmail, ip) {
        const inst = await this.findOne(id);
        const anterior = { nombre: inst.nombre, codigo: inst.codigo };
        Object.assign(inst, dto);
        const saved = await this.institucionRepository.save(inst);
        await this.auditoriaService.registrar({
            tabla: 'instituciones',
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
        const inst = await this.findOne(id);
        inst.activo = false;
        await this.institucionRepository.save(inst);
        await this.auditoriaService.registrar({
            tabla: 'instituciones',
            accion: auditoria_entity_1.AccionAuditoria.DELETE,
            registro_id: id,
            datos_anteriores: { nombre: inst.nombre, activo: true },
            datos_nuevos: { activo: false },
            usuario_id: usuarioId,
            usuario_email: usuarioEmail,
            ip,
        });
        return { message: `Institución ${id} desactivada correctamente` };
    }
};
exports.InstitucionesService = InstitucionesService;
exports.InstitucionesService = InstitucionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(institucion_entity_1.Institucion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auditoria_service_1.AuditoriaService])
], InstitucionesService);
//# sourceMappingURL=instituciones.service.js.map