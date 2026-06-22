"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitucionesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const institucion_entity_1 = require("./entities/institucion.entity");
const instituciones_service_1 = require("./instituciones.service");
const instituciones_controller_1 = require("./instituciones.controller");
const auditoria_module_1 = require("../auditoria/auditoria.module");
let InstitucionesModule = class InstitucionesModule {
};
exports.InstitucionesModule = InstitucionesModule;
exports.InstitucionesModule = InstitucionesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([institucion_entity_1.Institucion]),
            auditoria_module_1.AuditoriaModule,
        ],
        providers: [instituciones_service_1.InstitucionesService],
        controllers: [instituciones_controller_1.InstitucionesController],
        exports: [instituciones_service_1.InstitucionesService],
    })
], InstitucionesModule);
//# sourceMappingURL=instituciones.module.js.map