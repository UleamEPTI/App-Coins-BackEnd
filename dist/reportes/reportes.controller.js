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
exports.ReportesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const reportes_service_1 = require("./reportes.service");
let ReportesController = class ReportesController {
    reportesService;
    constructor(reportesService) {
        this.reportesService = reportesService;
    }
    async reporteInstitucion(institucion_id, periodo, res) {
        const buffer = await this.reportesService.generarReporteInstitucion(institucion_id, periodo);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="reporte-institucion-${institucion_id}.pdf"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async reporteCurso(curso_id, periodo, res) {
        const buffer = await this.reportesService.generarReporteCurso(curso_id, periodo);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="reporte-curso-${curso_id}.pdf"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Get)('institucion/:institucion_id'),
    __param(0, (0, common_1.Param)('institucion_id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('periodo')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteInstitucion", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)('curso/:curso_id'),
    __param(0, (0, common_1.Param)('curso_id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('periodo')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteCurso", null);
exports.ReportesController = ReportesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reportes'),
    __metadata("design:paramtypes", [reportes_service_1.ReportesService])
], ReportesController);
//# sourceMappingURL=reportes.controller.js.map