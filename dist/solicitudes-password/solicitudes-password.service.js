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
exports.SolicitudesPasswordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const solicitud_password_entity_1 = require("./entities/solicitud-password.entity");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const CAMPOS_USUARIO_SEGUROS = [
    'id', 'nombres', 'apellidos', 'cedula', 'telefono', 'email',
    'foto_perfil', 'institucion_id', 'curso_id', 'activo', 'materia',
    'created_at', 'updated_at',
];
let SolicitudesPasswordService = class SolicitudesPasswordService {
    solicitudRepository;
    usuarioRepository;
    constructor(solicitudRepository, usuarioRepository) {
        this.solicitudRepository = solicitudRepository;
        this.usuarioRepository = usuarioRepository;
    }
    async cambiarPasswordDirecto(usuarioObjetivoId, nuevaPassword, solicitanteId, solicitanteRol, solicitanteInstitucionId) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: usuarioObjetivoId },
            relations: ['rol'],
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (solicitanteRol && solicitanteRol !== 'ADMIN' && usuario.institucion_id !== solicitanteInstitucionId) {
            throw new common_1.ForbiddenException('No tienes permiso para cambiar la contraseña de este usuario');
        }
        const hash = await bcrypt.hash(nuevaPassword, 10);
        usuario.password_hash = hash;
        await this.usuarioRepository.save(usuario);
        return { message: `Contraseña de ${usuario.nombres} ${usuario.apellidos} actualizada correctamente` };
    }
    async crearSolicitud(dto, solicitanteId) {
        const solicitante = await this.usuarioRepository.findOne({ where: { id: solicitanteId } });
        if (!solicitante)
            throw new common_1.NotFoundException('Solicitante no encontrado');
        const objetivo = await this.usuarioRepository.findOne({ where: { id: dto.usuario_objetivo_id } });
        if (!objetivo)
            throw new common_1.NotFoundException('Usuario objetivo no encontrado');
        const solicitud = this.solicitudRepository.create({
            solicitado_por: solicitante,
            usuario_objetivo: objetivo,
            mensaje: dto.mensaje,
            estado: solicitud_password_entity_1.EstadoSolicitud.PENDIENTE,
        });
        const saved = await this.solicitudRepository.save(solicitud);
        return this.limpiarSolicitud(saved);
    }
    async findPendientes() {
        const solicitudes = await this.solicitudRepository.find({
            where: { estado: solicitud_password_entity_1.EstadoSolicitud.PENDIENTE },
            relations: ['solicitado_por', 'usuario_objetivo'],
            order: { created_at: 'DESC' },
        });
        return solicitudes.map(s => this.limpiarSolicitud(s));
    }
    async findAll() {
        const solicitudes = await this.solicitudRepository.find({
            relations: ['solicitado_por', 'usuario_objetivo'],
            order: { created_at: 'DESC' },
        });
        return solicitudes.map(s => this.limpiarSolicitud(s));
    }
    async atenderSolicitud(id, dto) {
        const solicitud = await this.solicitudRepository.findOne({
            where: { id },
            relations: ['usuario_objetivo'],
        });
        if (!solicitud)
            throw new common_1.NotFoundException('Solicitud no encontrada');
        if (solicitud.estado !== solicitud_password_entity_1.EstadoSolicitud.PENDIENTE) {
            throw new common_1.ForbiddenException('Esta solicitud ya fue atendida');
        }
        if (dto.estado === solicitud_password_entity_1.EstadoSolicitud.ATENDIDA) {
            const hash = await bcrypt.hash(dto.nueva_password, 10);
            solicitud.usuario_objetivo.password_hash = hash;
            await this.usuarioRepository.save(solicitud.usuario_objetivo);
        }
        solicitud.estado = dto.estado;
        if (dto.mensaje)
            solicitud.mensaje = dto.mensaje;
        const saved = await this.solicitudRepository.save(solicitud);
        return {
            solicitud: this.limpiarSolicitud(saved),
            message: dto.estado === solicitud_password_entity_1.EstadoSolicitud.ATENDIDA
                ? 'Contraseña cambiada exitosamente'
                : 'Solicitud rechazada',
        };
    }
    limpiarSolicitud(solicitud) {
        const limpia = { ...solicitud };
        if (limpia.solicitado_por) {
            const { password_hash, ...resto } = limpia.solicitado_por;
            limpia.solicitado_por = resto;
        }
        if (limpia.usuario_objetivo) {
            const { password_hash, ...resto } = limpia.usuario_objetivo;
            limpia.usuario_objetivo = resto;
        }
        return limpia;
    }
};
exports.SolicitudesPasswordService = SolicitudesPasswordService;
exports.SolicitudesPasswordService = SolicitudesPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(solicitud_password_entity_1.SolicitudPassword)),
    __param(1, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SolicitudesPasswordService);
//# sourceMappingURL=solicitudes-password.service.js.map