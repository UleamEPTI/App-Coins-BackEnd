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
exports.CreateTipoBotellaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTipoBotellaDto {
    institucion_id;
    tamano;
    puntos;
    activo;
}
exports.CreateTipoBotellaDto = CreateTipoBotellaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-de-la-institucion' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTipoBotellaDto.prototype, "institucion_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '500ml' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTipoBotellaDto.prototype, "tamano", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTipoBotellaDto.prototype, "puntos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTipoBotellaDto.prototype, "activo", void 0);
//# sourceMappingURL=create-tipo-botella.dto.js.map