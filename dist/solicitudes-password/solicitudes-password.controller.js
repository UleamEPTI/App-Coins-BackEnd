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
exports.SolicitudesPasswordController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const solicitudes_password_service_1 = require("./solicitudes-password.service");
const create_solicitud_dto_1 = require("./dto/create-solicitud.dto");
const atender_solicitud_dto_1 = require("./dto/atender-solicitud.dto");
let SolicitudesPasswordController = class SolicitudesPasswordController {
    service;
    constructor(service) {
        this.service = service;
    }
    cambiarDirecto(usuario_id, nueva_password, req) {
        return this.service.cambiarPasswordDirecto(usuario_id, nueva_password, req.user.id);
    }
    solicitar(dto, req) {
        return this.service.crearSolicitud(dto, req.user.id);
    }
    pendientes() {
        return this.service.findPendientes();
    }
    findAll() {
        return this.service.findAll();
    }
    atender(id, dto) {
        return this.service.atenderSolicitud(id, dto);
    }
};
exports.SolicitudesPasswordController = SolicitudesPasswordController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Post)('cambio-directo/:usuario_id'),
    (0, swagger_1.ApiOperation)({ summary: 'INSTITUCION/ADMIN cambia contraseña directamente' }),
    __param(0, (0, common_1.Param)('usuario_id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('nueva_password')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesPasswordController.prototype, "cambiarDirecto", null);
__decorate([
    (0, roles_decorator_1.Roles)('INSTITUCION'),
    (0, common_1.Post)('solicitar'),
    (0, swagger_1.ApiOperation)({ summary: 'INSTITUCION solicita al ADMIN cambiar contraseña' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_solicitud_dto_1.CreateSolicitudDto, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesPasswordController.prototype, "solicitar", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)('pendientes'),
    (0, swagger_1.ApiOperation)({ summary: 'ADMIN ve solicitudes pendientes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SolicitudesPasswordController.prototype, "pendientes", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'ADMIN ve todas las solicitudes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SolicitudesPasswordController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Put)(':id/atender'),
    (0, swagger_1.ApiOperation)({ summary: 'ADMIN atiende una solicitud' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, atender_solicitud_dto_1.AtenderSolicitudDto]),
    __metadata("design:returntype", void 0)
], SolicitudesPasswordController.prototype, "atender", null);
exports.SolicitudesPasswordController = SolicitudesPasswordController = __decorate([
    (0, swagger_1.ApiTags)('SolicitudesPassword'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('solicitudes-password'),
    __metadata("design:paramtypes", [solicitudes_password_service_1.SolicitudesPasswordService])
], SolicitudesPasswordController);
//# sourceMappingURL=solicitudes-password.controller.js.map