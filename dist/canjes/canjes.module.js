"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanjesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const canje_entity_1 = require("./entities/canje.entity");
const curso_entity_1 = require("../cursos/entities/curso.entity");
const premio_entity_1 = require("../premios/entities/premio.entity");
const historial_puntos_entity_1 = require("../puntos/entities/historial-puntos.entity");
const canjes_service_1 = require("./canjes.service");
const canjes_controller_1 = require("./canjes.controller");
const auditoria_module_1 = require("../auditoria/auditoria.module");
let CanjesModule = class CanjesModule {
};
exports.CanjesModule = CanjesModule;
exports.CanjesModule = CanjesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([canje_entity_1.Canje, curso_entity_1.Curso, premio_entity_1.Premio, historial_puntos_entity_1.HistorialPuntos]),
            auditoria_module_1.AuditoriaModule,
        ],
        providers: [canjes_service_1.CanjesService],
        controllers: [canjes_controller_1.CanjesController],
    })
], CanjesModule);
//# sourceMappingURL=canjes.module.js.map