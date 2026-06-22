"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReciclajesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reciclaje_entity_1 = require("./entities/reciclaje.entity");
const estudiante_entity_1 = require("../estudiantes/entities/estudiante.entity");
const tipo_botella_entity_1 = require("../tipos-botella/entities/tipo-botella.entity");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const historial_puntos_entity_1 = require("../puntos/entities/historial-puntos.entity");
const reciclajes_service_1 = require("./reciclajes.service");
const reciclajes_controller_1 = require("./reciclajes.controller");
const auditoria_module_1 = require("../auditoria/auditoria.module");
let ReciclajesModule = class ReciclajesModule {
};
exports.ReciclajesModule = ReciclajesModule;
exports.ReciclajesModule = ReciclajesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([reciclaje_entity_1.Reciclaje, estudiante_entity_1.Estudiante, tipo_botella_entity_1.TipoBotella, usuario_entity_1.Usuario, historial_puntos_entity_1.HistorialPuntos]),
            auditoria_module_1.AuditoriaModule,
        ],
        providers: [reciclajes_service_1.ReciclajesService],
        controllers: [reciclajes_controller_1.ReciclajesController],
        exports: [reciclajes_service_1.ReciclajesService],
    })
], ReciclajesModule);
//# sourceMappingURL=reciclajes.module.js.map