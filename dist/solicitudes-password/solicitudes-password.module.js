"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudesPasswordModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const solicitud_password_entity_1 = require("./entities/solicitud-password.entity");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const solicitudes_password_service_1 = require("./solicitudes-password.service");
const solicitudes_password_controller_1 = require("./solicitudes-password.controller");
let SolicitudesPasswordModule = class SolicitudesPasswordModule {
};
exports.SolicitudesPasswordModule = SolicitudesPasswordModule;
exports.SolicitudesPasswordModule = SolicitudesPasswordModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([solicitud_password_entity_1.SolicitudPassword, usuario_entity_1.Usuario])],
        providers: [solicitudes_password_service_1.SolicitudesPasswordService],
        controllers: [solicitudes_password_controller_1.SolicitudesPasswordController],
    })
], SolicitudesPasswordModule);
//# sourceMappingURL=solicitudes-password.module.js.map