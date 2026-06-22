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
exports.AuditoriaController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auditoria_service_1 = require("./auditoria.service");
let AuditoriaController = class AuditoriaController {
    auditoriaService;
    constructor(auditoriaService) {
        this.auditoriaService = auditoriaService;
    }
    findAll() {
        return this.auditoriaService.findAll();
    }
    findByTabla(tabla) {
        return this.auditoriaService.findByTabla(tabla);
    }
    findByUsuario(usuario_id) {
        return this.auditoriaService.findByUsuario(usuario_id);
    }
    findByRegistro(tabla, registro_id) {
        return this.auditoriaService.findByRegistro(tabla, registro_id);
    }
};
exports.AuditoriaController = AuditoriaController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuditoriaController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)('tabla/:tabla'),
    __param(0, (0, common_1.Param)('tabla')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuditoriaController.prototype, "findByTabla", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Get)('usuario/:usuario_id'),
    __param(0, (0, common_1.Param)('usuario_id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuditoriaController.prototype, "findByUsuario", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Get)(':tabla/:registro_id'),
    __param(0, (0, common_1.Param)('tabla')),
    __param(1, (0, common_1.Param)('registro_id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuditoriaController.prototype, "findByRegistro", null);
exports.AuditoriaController = AuditoriaController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('auditoria'),
    __metadata("design:paramtypes", [auditoria_service_1.AuditoriaService])
], AuditoriaController);
//# sourceMappingURL=auditoria.controller.js.map