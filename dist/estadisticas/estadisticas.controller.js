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
exports.EstadisticasController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const estadisticas_service_1 = require("./estadisticas.service");
let EstadisticasController = class EstadisticasController {
    estadisticasService;
    constructor(estadisticasService) {
        this.estadisticasService = estadisticasService;
    }
    statsInstitucion(institucion_id) {
        return this.estadisticasService.statsInstitucion(institucion_id);
    }
    statsCurso(curso_id) {
        return this.estadisticasService.statsCurso(curso_id);
    }
    rankingInstitucion(institucion_id) {
        return this.estadisticasService.rankingInstitucion(institucion_id);
    }
};
exports.EstadisticasController = EstadisticasController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Get)('institucion/:institucion_id'),
    __param(0, (0, common_1.Param)('institucion_id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstadisticasController.prototype, "statsInstitucion", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)('curso/:curso_id'),
    __param(0, (0, common_1.Param)('curso_id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstadisticasController.prototype, "statsCurso", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)('ranking/institucion/:institucion_id'),
    __param(0, (0, common_1.Param)('institucion_id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstadisticasController.prototype, "rankingInstitucion", null);
exports.EstadisticasController = EstadisticasController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('estadisticas'),
    __metadata("design:paramtypes", [estadisticas_service_1.EstadisticasService])
], EstadisticasController);
//# sourceMappingURL=estadisticas.controller.js.map