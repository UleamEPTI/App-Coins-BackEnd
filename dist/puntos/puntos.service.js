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
const curso_entity_1 = require("../cursos/entities/curso.entity");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const auditoria_entity_1 = require("../auditoria/entities/auditoria.entity");
let PuntosService = class PuntosService {
    historialRepository;
    cursoRepository;
    auditoriaService;
    constructor(historialRepository, cursoRepository, auditoriaService) {
        this.historialRepository = historialRepository;
        this.cursoRepository = cursoRepository;
        this.auditoriaService = auditoriaService;
    }
    async modificarPuntos(dto, usuarioId, usuarioEmail, ip) {
        const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
        if (!curso)
            throw new common_1.NotFoundException(`Curso ${dto.curso_id} no encontrado`);
        const puntosAnteriores = curso.puntos;
        if (dto.tipo === historial_puntos_entity_1.TipoTransaccion.RESTA || dto.tipo === historial_puntos_entity_1.TipoTransaccion.CANJE) {
            if (curso.puntos < dto.puntos) {
                throw new common_1.BadRequestException(`Puntos insuficientes. Tiene ${curso.puntos}, necesita ${dto.puntos}`);
            }
            curso.puntos -= dto.puntos;
        }
        else {
            curso.puntos += dto.puntos;
        }
        await this.cursoRepository.save(curso);
        const transaccion = this.historialRepository.create({
            curso,
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
                puntos_resultantes: curso.puntos,
            },
            usuario_id: usuarioId,
            usuario_email: usuarioEmail,
            ip,
        });
        return { curso, transaccion };
    }
    async getHistorial(curso_id) {
        const curso = await this.cursoRepository.findOne({ where: { id: curso_id } });
        if (!curso)
            throw new common_1.NotFoundException(`Curso ${curso_id} no encontrado`);
        return this.historialRepository.find({
            where: { curso: { id: curso_id } },
            order: { created_at: 'DESC' },
        });
    }
};
exports.PuntosService = PuntosService;
exports.PuntosService = PuntosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historial_puntos_entity_1.HistorialPuntos)),
    __param(1, (0, typeorm_1.InjectRepository)(curso_entity_1.Curso)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auditoria_service_1.AuditoriaService])
], PuntosService);
//# sourceMappingURL=puntos.service.js.map