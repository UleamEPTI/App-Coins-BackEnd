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
exports.AuditoriaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auditoria_entity_1 = require("./entities/auditoria.entity");
let AuditoriaService = class AuditoriaService {
    auditoriaRepository;
    constructor(auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }
    async registrar(payload) {
        const registro = this.auditoriaRepository.create(payload);
        await this.auditoriaRepository.save(registro);
    }
    async findAll() {
        return this.auditoriaRepository.find({
            order: { created_at: 'DESC' },
        });
    }
    async findByTabla(tabla) {
        return this.auditoriaRepository.find({
            where: { tabla },
            order: { created_at: 'DESC' },
        });
    }
    async findByUsuario(usuario_id) {
        return this.auditoriaRepository.find({
            where: { usuario_id },
            order: { created_at: 'DESC' },
        });
    }
    async findByRegistro(tabla, registro_id) {
        return this.auditoriaRepository.find({
            where: { tabla, registro_id },
            order: { created_at: 'DESC' },
        });
    }
};
exports.AuditoriaService = AuditoriaService;
exports.AuditoriaService = AuditoriaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auditoria_entity_1.Auditoria)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditoriaService);
//# sourceMappingURL=auditoria.service.js.map