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
exports.EstadisticasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const curso_entity_1 = require("../cursos/entities/curso.entity");
const reciclaje_entity_1 = require("../reciclajes/entities/reciclaje.entity");
const canje_entity_1 = require("../canjes/entities/canje.entity");
let EstadisticasService = class EstadisticasService {
    cursoRepository;
    reciclajeRepository;
    canjeRepository;
    constructor(cursoRepository, reciclajeRepository, canjeRepository) {
        this.cursoRepository = cursoRepository;
        this.reciclajeRepository = reciclajeRepository;
        this.canjeRepository = canjeRepository;
    }
    async rankingInstitucion(institucion_id, usuarioRol, usuarioInstitucionId) {
        if (usuarioRol && usuarioRol !== 'ADMIN' && institucion_id !== usuarioInstitucionId) {
            throw new common_1.ForbiddenException('No tienes permiso para ver el ranking de esta institución');
        }
        return this.cursoRepository
            .createQueryBuilder('c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .andWhere('c.activo = true')
            .orderBy('c.puntos', 'DESC')
            .select(['c.id', 'c.puntos', 'c.nombre', 'c.paralelo'])
            .getMany();
    }
    async statsInstitucion(institucion_id, usuarioRol, usuarioInstitucionId) {
        if (usuarioRol && usuarioRol !== 'ADMIN' && institucion_id !== usuarioInstitucionId) {
            throw new common_1.ForbiddenException('No tienes permiso para ver las estadísticas de esta institución');
        }
        const totalCursos = await this.cursoRepository
            .createQueryBuilder('c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .andWhere('c.activo = true')
            .getCount();
        const reciclajes = await this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoin('r.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .getMany();
        const totalKilos = reciclajes.reduce((sum, r) => sum + r.kilos, 0);
        const totalPuntosGenerados = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);
        const totalCanjes = await this.canjeRepository
            .createQueryBuilder('cj')
            .leftJoin('cj.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .getCount();
        return {
            totalCursos,
            totalKilos,
            totalPuntosGenerados,
            totalCanjes,
        };
    }
    async statsCurso(curso_id, usuarioRol, usuarioInstitucionId) {
        if (usuarioRol && usuarioRol !== 'ADMIN') {
            const pertenece = await this.cursoRepository
                .createQueryBuilder('c')
                .where('c.id = :curso_id AND c.institucion_id = :institucion_id', { curso_id, institucion_id: usuarioInstitucionId })
                .getExists();
            if (!pertenece)
                throw new common_1.NotFoundException(`Curso ${curso_id} no encontrado`);
        }
        const reciclajes = await this.reciclajeRepository
            .createQueryBuilder('r')
            .where('r.curso_id = :curso_id', { curso_id })
            .getMany();
        const totalKilos = reciclajes.reduce((sum, r) => sum + r.kilos, 0);
        const totalPuntosGenerados = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);
        return {
            totalKilos,
            totalPuntosGenerados,
        };
    }
};
exports.EstadisticasService = EstadisticasService;
exports.EstadisticasService = EstadisticasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(curso_entity_1.Curso)),
    __param(1, (0, typeorm_1.InjectRepository)(reciclaje_entity_1.Reciclaje)),
    __param(2, (0, typeorm_1.InjectRepository)(canje_entity_1.Canje)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EstadisticasService);
//# sourceMappingURL=estadisticas.service.js.map