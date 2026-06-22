"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuntosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const historial_puntos_entity_1 = require("./entities/historial-puntos.entity");
const estudiante_entity_1 = require("../estudiantes/entities/estudiante.entity");
const puntos_service_1 = require("./puntos.service");
const puntos_controller_1 = require("./puntos.controller");
const auditoria_module_1 = require("../auditoria/auditoria.module");
let PuntosModule = class PuntosModule {
};
exports.PuntosModule = PuntosModule;
exports.PuntosModule = PuntosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([historial_puntos_entity_1.HistorialPuntos, estudiante_entity_1.Estudiante]),
            auditoria_module_1.AuditoriaModule,
        ],
        providers: [puntos_service_1.PuntosService],
        controllers: [puntos_controller_1.PuntosController],
        exports: [puntos_service_1.PuntosService],
    })
], PuntosModule);
//# sourceMappingURL=puntos.module.js.map