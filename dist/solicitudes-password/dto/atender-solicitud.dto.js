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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtenderSolicitudDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const solicitud_password_entity_1 = require("../entities/solicitud-password.entity");
class AtenderSolicitudDto {
    nueva_password;
    estado;
    mensaje;
}
exports.AtenderSolicitudDto = AtenderSolicitudDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'nuevaPassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], AtenderSolicitudDto.prototype, "nueva_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: solicitud_password_entity_1.EstadoSolicitud, example: solicitud_password_entity_1.EstadoSolicitud.ATENDIDA }),
    (0, class_validator_1.IsEnum)(solicitud_password_entity_1.EstadoSolicitud),
    __metadata("design:type", String)
], AtenderSolicitudDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Contraseña cambiada exitosamente', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AtenderSolicitudDto.prototype, "mensaje", void 0);
//# sourceMappingURL=atender-solicitud.dto.js.map