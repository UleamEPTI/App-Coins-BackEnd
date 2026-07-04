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
exports.EstudiantesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const estudiante_entity_1 = require("./entities/estudiante.entity");
const curso_entity_1 = require("./entities/curso.entity");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
let EstudiantesService = class EstudiantesService {
    estudianteRepository;
    cursoRepository;
    usuarioRepository;
    constructor(estudianteRepository, cursoRepository, usuarioRepository) {
        this.estudianteRepository = estudianteRepository;
        this.cursoRepository = cursoRepository;
        this.usuarioRepository = usuarioRepository;
    }
    async create(dto) {
        const usuario = await this.usuarioRepository.findOne({ where: { id: dto.usuario_id } });
        if (!usuario)
            throw new common_1.NotFoundException(`Usuario ${dto.usuario_id} no encontrado`);
        const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
        if (!curso)
            throw new common_1.NotFoundException(`Curso ${dto.curso_id} no encontrado`);
        const estudiante = this.estudianteRepository.create({
            usuario,
            curso,
            codigo_estudiante: dto.codigo_estudiante,
            fecha_nacimiento: dto.fecha_nacimiento ? new Date(dto.fecha_nacimiento) : undefined,
            direccion: dto.direccion,
        });
        return this.estudianteRepository.save(estudiante);
    }
    async findAll(filtros = {}) {
        const { search, curso_id, institucion_id, activo, page = 1, limit = 20, sort = 'apellidos', order = 'ASC', } = filtros;
        const query = this.estudianteRepository
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.usuario', 'u')
            .leftJoinAndSelect('e.curso', 'c');
        if (activo !== undefined) {
            query.andWhere('e.activo = :activo', { activo });
        }
        else {
            query.andWhere('e.activo = true');
        }
        if (curso_id) {
            query.andWhere('e.curso_id = :curso_id', { curso_id });
        }
        if (institucion_id) {
            query.andWhere('c.institucion_id = :institucion_id', { institucion_id });
        }
        if (search) {
            query.andWhere('(LOWER(u.nombres) LIKE :search OR LOWER(u.apellidos) LIKE :search OR LOWER(e.codigo_estudiante) LIKE :search)', { search: `%${search.toLowerCase()}%` });
        }
        const total = await query.getCount();
        if (sort === 'apellidos') {
            query.orderBy('u.apellidos', order);
        }
        else if (sort === 'puntos') {
            query.orderBy('e.puntos', order);
        }
        else {
            query.orderBy(`e.${sort}`, order);
        }
        query.skip((page - 1) * limit).take(limit);
        const data = await query.getMany();
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const estudiante = await this.estudianteRepository.findOne({
            where: { id },
            relations: ['usuario', 'curso'],
        });
        if (!estudiante)
            throw new common_1.NotFoundException(`Estudiante ${id} no encontrado`);
        return estudiante;
    }
    async update(id, dto) {
        const estudiante = await this.findOne(id);
        if (dto.usuario_id) {
            const usuario = await this.usuarioRepository.findOne({ where: { id: dto.usuario_id } });
            if (!usuario)
                throw new common_1.NotFoundException(`Usuario ${dto.usuario_id} no encontrado`);
            estudiante.usuario = usuario;
        }
        if (dto.curso_id) {
            const curso = await this.cursoRepository.findOne({ where: { id: dto.curso_id } });
            if (!curso)
                throw new common_1.NotFoundException(`Curso ${dto.curso_id} no encontrado`);
            estudiante.curso = curso;
        }
        if (dto.codigo_estudiante !== undefined)
            estudiante.codigo_estudiante = dto.codigo_estudiante;
        if (dto.fecha_nacimiento)
            estudiante.fecha_nacimiento = new Date(dto.fecha_nacimiento);
        if (dto.direccion !== undefined)
            estudiante.direccion = dto.direccion;
        return this.estudianteRepository.save(estudiante);
    }
    async remove(id) {
        const estudiante = await this.findOne(id);
        estudiante.activo = false;
        await this.estudianteRepository.save(estudiante);
        return { message: `Estudiante ${id} desactivado correctamente` };
    }
};
exports.EstudiantesService = EstudiantesService;
exports.EstudiantesService = EstudiantesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __param(1, (0, typeorm_1.InjectRepository)(curso_entity_1.Curso)),
    __param(2, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EstudiantesService);
//# sourceMappingURL=estudiantes.service.js.map