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
const estudiante_entity_1 = require("../estudiantes/entities/estudiante.entity");
const reciclaje_entity_1 = require("../reciclajes/entities/reciclaje.entity");
const canje_entity_1 = require("../canjes/entities/canje.entity");
let EstadisticasService = class EstadisticasService {
    estudianteRepository;
    reciclajeRepository;
    canjeRepository;
    constructor(estudianteRepository, reciclajeRepository, canjeRepository) {
        this.estudianteRepository = estudianteRepository;
        this.reciclajeRepository = reciclajeRepository;
        this.canjeRepository = canjeRepository;
    }
    async rankingCurso(curso_id) {
        return this.estudianteRepository
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.usuario', 'u')
            .where('e.curso_id = :curso_id', { curso_id })
            .andWhere('e.activo = true')
            .orderBy('e.puntos', 'DESC')
            .select([
            'e.id',
            'e.puntos',
            'e.codigo_estudiante',
            'u.nombres',
            'u.apellidos',
        ])
            .getMany();
    }
    async rankingInstitucion(institucion_id) {
        return this.estudianteRepository
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.usuario', 'u')
            .leftJoinAndSelect('e.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .andWhere('e.activo = true')
            .orderBy('e.puntos', 'DESC')
            .select([
            'e.id',
            'e.puntos',
            'e.codigo_estudiante',
            'u.nombres',
            'u.apellidos',
            'c.nombre',
            'c.paralelo',
        ])
            .getMany();
    }
    async statsInstitucion(institucion_id) {
        const totalEstudiantes = await this.estudianteRepository
            .createQueryBuilder('e')
            .leftJoin('e.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .andWhere('e.activo = true')
            .getCount();
        const reciclajes = await this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoin('r.estudiante', 'e')
            .leftJoin('e.curso', 'c')
            .leftJoinAndSelect('r.tipo_botella', 'tb')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .getMany();
        const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
        const totalPuntosGenerados = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);
        const botellaPorTipo = {};
        reciclajes.forEach(r => {
            const tamano = r.tipo_botella?.tamano ?? 'desconocido';
            botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
        });
        const totalCanjes = await this.canjeRepository
            .createQueryBuilder('cj')
            .leftJoin('cj.estudiante', 'e')
            .leftJoin('e.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .getCount();
        return {
            totalEstudiantes,
            totalBotellas,
            totalPuntosGenerados,
            totalCanjes,
            botellaPorTipo,
        };
    }
    async statsCurso(curso_id) {
        const totalEstudiantes = await this.estudianteRepository
            .createQueryBuilder('e')
            .where('e.curso_id = :curso_id', { curso_id })
            .andWhere('e.activo = true')
            .getCount();
        const reciclajes = await this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoin('r.estudiante', 'e')
            .leftJoinAndSelect('r.tipo_botella', 'tb')
            .where('e.curso_id = :curso_id', { curso_id })
            .getMany();
        const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
        const totalPuntosGenerados = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);
        const botellaPorTipo = {};
        reciclajes.forEach(r => {
            const tamano = r.tipo_botella?.tamano ?? 'desconocido';
            botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
        });
        return {
            totalEstudiantes,
            totalBotellas,
            totalPuntosGenerados,
            botellaPorTipo,
        };
    }
};
exports.EstadisticasService = EstadisticasService;
exports.EstadisticasService = EstadisticasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __param(1, (0, typeorm_1.InjectRepository)(reciclaje_entity_1.Reciclaje)),
    __param(2, (0, typeorm_1.InjectRepository)(canje_entity_1.Canje)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EstadisticasService);
//# sourceMappingURL=estadisticas.service.js.map