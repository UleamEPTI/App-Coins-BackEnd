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
exports.ModificarPuntosDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const historial_puntos_entity_1 = require("../entities/historial-puntos.entity");
class ModificarPuntosDto {
    curso_id;
    puntos;
    tipo;
    descripcion;
}
exports.ModificarPuntosDto = ModificarPuntosDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-del-curso' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ModificarPuntosDto.prototype, "curso_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ModificarPuntosDto.prototype, "puntos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: historial_puntos_entity_1.TipoTransaccion, example: historial_puntos_entity_1.TipoTransaccion.SUMA }),
    (0, class_validator_1.IsEnum)(historial_puntos_entity_1.TipoTransaccion),
    __metadata("design:type", String)
], ModificarPuntosDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Participación en evento', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModificarPuntosDto.prototype, "descripcion", void 0);
//# sourceMappingURL=modificar-puntos.dto.js.map