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
exports.PuntosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const historial_puntos_entity_1 = require("./entities/historial-puntos.entity");
const estudiante_entity_1 = require("../estudiantes/entities/estudiante.entity");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const auditoria_entity_1 = require("../auditoria/entities/auditoria.entity");
let PuntosService = class PuntosService {
    historialRepository;
    estudianteRepository;
    auditoriaService;
    constructor(historialRepository, estudianteRepository, auditoriaService) {
        this.historialRepository = historialRepository;
        this.estudianteRepository = estudianteRepository;
        this.auditoriaService = auditoriaService;
    }
    async modificarPuntos(dto, usuarioId, usuarioEmail, ip) {
        const estudiante = await this.estudianteRepository.findOne({ where: { id: dto.estudiante_id } });
        if (!estudiante)
            throw new common_1.NotFoundException(`Estudiante ${dto.estudiante_id} no encontrado`);
        const puntosAnteriores = estudiante.puntos;
        if (dto.tipo === historial_puntos_entity_1.TipoTransaccion.RESTA || dto.tipo === historial_puntos_entity_1.TipoTransaccion.CANJE) {
            if (estudiante.puntos < dto.puntos) {
                throw new common_1.BadRequestException(`Puntos insuficientes. Tiene ${estudiante.puntos}, necesita ${dto.puntos}`);
            }
            estudiante.puntos -= dto.puntos;
        }
        else {
            estudiante.puntos += dto.puntos;
        }
        await this.estudianteRepository.save(estudiante);
        const transaccion = this.historialRepository.create({
            estudiante,
            tipo: dto.tipo,
            puntos: dto.puntos,
            descripcion: dto.descripcion,
        });
        await this.historialRepository.save(transaccion);
        await this.auditoriaService.registrar({
            tabla: 'historial_puntos',
            accion: auditoria_entity_1.AccionAuditoria.CREATE,
            registro_id: transaccion.id,
            datos_anteriores: { puntos: puntosAnteriores },
            datos_nuevos: {
                tipo: dto.tipo,
                puntos: dto.puntos,
                descripcion: dto.descripcion,
                puntos_resultantes: estudiante.puntos,
            },
            usuario_id: usuarioId,
            usuario_email: usuarioEmail,
            ip,
        });
        return { estudiante, transaccion };
    }
    async getHistorial(estudiante_id) {
        const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
        if (!estudiante)
            throw new common_1.NotFoundException(`Estudiante ${estudiante_id} no encontrado`);
        return this.historialRepository.find({
            where: { estudiante: { id: estudiante_id } },
            order: { created_at: 'DESC' },
        });
    }
};
exports.PuntosService = PuntosService;
exports.PuntosService = PuntosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historial_puntos_entity_1.HistorialPuntos)),
    __param(1, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auditoria_service_1.AuditoriaService])
], PuntosService);
//# sourceMappingURL=puntos.service.js.map