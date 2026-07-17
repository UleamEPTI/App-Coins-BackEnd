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
exports.CanjesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const canjes_service_1 = require("./canjes.service");
const create_canje_dto_1 = require("./dto/create-canje.dto");
const canje_entity_1 = require("./entities/canje.entity");
let CanjesController = class CanjesController {
    canjesService;
    constructor(canjesService) {
        this.canjesService = canjesService;
    }
    canjear(dto, req) {
        const ip = req.ip ?? req.headers['x-forwarded-for'];
        return this.canjesService.canjear(dto, req.user.id, req.user.email, req.user.rol, req.user.institucion_id, ip);
    }
    findAll() {
        return this.canjesService.findAll();
    }
    findByCurso(curso_id, req) {
        return this.canjesService.findByCurso(curso_id, req.user.rol, req.user.institucion_id);
    }
    actualizarEstado(id, estado, req) {
        const ip = req.ip ?? req.headers['x-forwarded-for'];
        return this.canjesService.actualizarEstado(id, estado, req.user.id, req.user.email, ip);
    }
};
exports.CanjesController = CanjesController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_canje_dto_1.CreateCanjeDto, Object]),
    __metadata("design:returntype", void 0)
], CanjesController.prototype, "canjear", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CanjesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)('curso/:curso_id'),
    __param(0, (0, common_1.Param)('curso_id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CanjesController.prototype, "findByCurso", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Put)(':id/estado'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('estado')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CanjesController.prototype, "actualizarEstado", null);
exports.CanjesController = CanjesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('canjes'),
    __metadata("design:paramtypes", [canjes_service_1.CanjesService])
], CanjesController);
//# sourceMappingURL=canjes.controller.js.map