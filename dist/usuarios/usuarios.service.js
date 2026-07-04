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
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const usuario_entity_1 = require("./entities/usuario.entity");
const rol_entity_1 = require("./entities/rol.entity");
let UsuariosService = class UsuariosService {
    usuarioRepository;
    rolRepository;
    constructor(usuarioRepository, rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }
    async findAll() {
        return this.usuarioRepository.find({
            relations: ['rol'],
            select: ['id', 'nombres', 'apellidos', 'email', 'cedula', 'telefono', 'activo', 'created_at'],
        });
    }
    async findOne(id) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: ['rol'],
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return usuario;
    }
    async findByEmail(email) {
        return this.usuarioRepository.findOne({
            where: { email },
            relations: ['rol'],
        });
    }
    async findById(id) {
        return this.usuarioRepository.findOne({
            where: { id },
            relations: ['rol'],
        });
    }
    async findByInstitucion(institucion_id) {
        return this.usuarioRepository.find({
            where: { institucion_id },
            relations: ['rol'],
        });
    }
    async create(dto) {
        const existe = await this.usuarioRepository.findOne({ where: { email: dto.email } });
        if (existe)
            throw new common_1.ConflictException('El email ya está registrado');
        const rol = await this.rolRepository.findOne({ where: { id: dto.rol_id } });
        if (!rol)
            throw new common_1.NotFoundException('Rol no encontrado');
        const hash = await bcrypt.hash(dto.password, 10);
        const usuario = this.usuarioRepository.create({
            nombres: dto.nombres,
            apellidos: dto.apellidos,
            email: dto.email,
            cedula: dto.cedula,
            telefono: dto.telefono,
            password_hash: hash,
            rol,
            institucion_id: dto.institucion_id,
            curso_id: dto.curso_id,
            materia: dto.materia,
            activo: true,
            debe_cambiar_password: true,
        });
        const saved = await this.usuarioRepository.save(usuario);
        const { password_hash, ...result } = saved;
        return result;
    }
    async update(id, dto) {
        const usuario = await this.findOne(id);
        if (dto.password) {
            usuario.password_hash = await bcrypt.hash(dto.password, 10);
        }
        if (dto.nombres)
            usuario.nombres = dto.nombres;
        if (dto.apellidos)
            usuario.apellidos = dto.apellidos;
        if (dto.cedula)
            usuario.cedula = dto.cedula;
        if (dto.telefono)
            usuario.telefono = dto.telefono;
        if (dto.institucion_id)
            usuario.institucion_id = dto.institucion_id;
        if (dto.curso_id)
            usuario.curso_id = dto.curso_id;
        if (dto.materia !== undefined)
            usuario.materia = dto.materia;
        const saved = await this.usuarioRepository.save(usuario);
        const { password_hash, ...result } = saved;
        return result;
    }
    async remove(id) {
        const usuario = await this.findOne(id);
        usuario.activo = false;
        await this.usuarioRepository.save(usuario);
        return { message: 'Usuario desactivado correctamente' };
    }
    async save(usuario) {
        return this.usuarioRepository.save(usuario);
    }
    async findAllFiltrado(filtros = {}) {
        const { search, rol, institucion_id, estado, page = 1, limit = 20 } = filtros;
        const query = this.usuarioRepository
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.rol', 'r')
            .select([
            'u.id', 'u.nombres', 'u.apellidos', 'u.email',
            'u.cedula', 'u.telefono', 'u.activo', 'u.materia',
            'u.institucion_id', 'u.created_at', 'r.id', 'r.nombre',
        ]);
        if (estado === 'inactivo') {
            query.andWhere('u.activo = false');
        }
        else {
            query.andWhere('u.activo = true');
        }
        if (rol) {
            query.andWhere('LOWER(r.nombre) = :rol', { rol: rol.toLowerCase() });
        }
        if (institucion_id) {
            query.andWhere('u.institucion_id = :institucion_id', { institucion_id });
        }
        if (search) {
            query.andWhere('(LOWER(u.nombres) LIKE :search OR LOWER(u.apellidos) LIKE :search OR LOWER(u.email) LIKE :search)', { search: `%${search.toLowerCase()}%` });
        }
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit).orderBy('u.apellidos', 'ASC');
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getRoles() {
        return this.rolRepository.find();
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(1, (0, typeorm_1.InjectRepository)(rol_entity_1.Rol)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map