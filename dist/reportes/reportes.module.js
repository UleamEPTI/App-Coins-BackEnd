"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const curso_entity_1 = require("../cursos/entities/curso.entity");
const reciclaje_entity_1 = require("../reciclajes/entities/reciclaje.entity");
const reportes_service_1 = require("./reportes.service");
const reportes_controller_1 = require("./reportes.controller");
let ReportesModule = class ReportesModule {
};
exports.ReportesModule = ReportesModule;
exports.ReportesModule = ReportesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([curso_entity_1.Curso, reciclaje_entity_1.Reciclaje])],
        providers: [reportes_service_1.ReportesService],
        controllers: [reportes_controller_1.ReportesController],
    })
], ReportesModule);
//# sourceMappingURL=reportes.module.js.map