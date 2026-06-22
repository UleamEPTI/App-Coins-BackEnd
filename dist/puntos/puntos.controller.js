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
exports.PuntosController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const puntos_service_1 = require("./puntos.service");
const modificar_puntos_dto_1 = require("./dto/modificar-puntos.dto");
let PuntosController = class PuntosController {
    puntosService;
    constructor(puntosService) {
        this.puntosService = puntosService;
    }
    modificar(dto, req) {
        const ip = req.ip ?? req.headers['x-forwarded-for'];
        return this.puntosService.modificarPuntos(dto, req.user.id, req.user.email, ip);
    }
    historial(estudiante_id) {
        return this.puntosService.getHistorial(estudiante_id);
    }
};
exports.PuntosController = PuntosController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [modificar_puntos_dto_1.ModificarPuntosDto, Object]),
    __metadata("design:returntype", void 0)
], PuntosController.prototype, "modificar", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE', 'ESTUDIANTE'),
    (0, common_1.Get)('historial/:estudiante_id'),
    __param(0, (0, common_1.Param)('estudiante_id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PuntosController.prototype, "historial", null);
exports.PuntosController = PuntosController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('puntos'),
    __metadata("design:paramtypes", [puntos_service_1.PuntosService])
], PuntosController);
//# sourceMappingURL=puntos.controller.js.map