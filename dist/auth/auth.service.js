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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const usuarios_service_1 = require("../usuarios/usuarios.service");
let AuthService = class AuthService {
    usuariosService;
    jwtService;
    constructor(usuariosService, jwtService) {
        this.usuariosService = usuariosService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const usuario = await this.usuariosService.findByEmail(email);
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        if (!usuario.activo) {
            throw new common_1.UnauthorizedException('Usuario inactivo');
        }
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const profile = await this.buildProfilePayload(usuario);
        const payload = {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol.nombre,
            institucion_id: usuario.institucion_id ?? null,
        };
        return {
            access_token: this.jwtService.sign(payload),
            usuario: profile,
        };
    }
    async getProfile(userId) {
        const usuario = await this.usuariosService.findById(userId);
        if (!usuario) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        return this.buildProfilePayload(usuario);
    }
    async refreshToken(userId) {
        const usuario = await this.usuariosService.findById(userId);
        if (!usuario || !usuario.activo) {
            throw new common_1.UnauthorizedException('Usuario no válido');
        }
        const profile = await this.buildProfilePayload(usuario);
        const payload = {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol.nombre,
            institucion_id: usuario.institucion_id ?? null,
        };
        return {
            access_token: this.jwtService.sign(payload),
            usuario: profile,
        };
    }
    async buildProfilePayload(usuario) {
        const baseProfile = {
            id: usuario.id,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            rol: usuario.rol.nombre,
            activo: usuario.activo,
            debe_cambiar_password: usuario.debe_cambiar_password,
            institucion_id: usuario.institucion_id,
            curso_id: usuario.curso_id,
        };
        return baseProfile;
    }
    async cambiarPasswordPropia(userId, passwordActual, passwordNueva) {
        const usuario = await this.usuariosService.findById(userId);
        if (!usuario) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const passwordValida = await bcrypt.compare(passwordActual, usuario.password_hash);
        if (!passwordValida) {
            throw new common_1.UnauthorizedException('La contraseña actual es incorrecta');
        }
        usuario.password_hash = await bcrypt.hash(passwordNueva, 10);
        usuario.debe_cambiar_password = false;
        await this.usuariosService.save(usuario);
        return { message: 'Contraseña actualizada correctamente' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map