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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const usuarios_service_1 = require("./usuarios.service");
const create_usuario_dto_1 = require("./dto/create-usuario.dto");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let UsuariosController = class UsuariosController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    findAll(search, rol, institucion_id, estado, page, limit) {
        return this.usuariosService.findAllFiltrado({
            search,
            rol,
            institucion_id,
            estado,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
    }
    getRoles() {
        return this.usuariosService.getRoles();
    }
    findOne(id) {
        return this.usuariosService.findOne(id);
    }
    create(dto) {
        return this.usuariosService.create(dto);
    }
    update(id, dto) {
        return this.usuariosService.update(id, dto);
    }
    remove(id) {
        return this.usuariosService.remove(id);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar usuarios con filtros y paginación' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Buscar por nombre, apellido o email' }),
    (0, swagger_1.ApiQuery)({ name: 'rol', required: false, description: 'ADMIN, INSTITUCION, DOCENTE, ESTUDIANTE' }),
    (0, swagger_1.ApiQuery)({ name: 'institucion_id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'estado', required: false, enum: ['activo', 'inactivo'] }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Página (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Resultados por página (default: 20)' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('rol')),
    __param(2, (0, common_1.Query)('institucion_id')),
    __param(3, (0, common_1.Query)('estado')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de roles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "getRoles", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver un usuario' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear usuario' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar usuario' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "remove", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, swagger_1.ApiTags)('Usuarios'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map