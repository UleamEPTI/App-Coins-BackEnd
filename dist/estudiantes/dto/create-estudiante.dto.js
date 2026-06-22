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
exports.CreateEstudianteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEstudianteDto {
    usuario_id;
    curso_id;
    codigo_estudiante;
    fecha_nacimiento;
    direccion;
}
exports.CreateEstudianteDto = CreateEstudianteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-del-usuario' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEstudianteDto.prototype, "usuario_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-del-curso' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEstudianteDto.prototype, "curso_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EST-001', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEstudianteDto.prototype, "codigo_estudiante", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2005-03-15', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEstudianteDto.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Av. Principal 123', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEstudianteDto.prototype, "direccion", void 0);
//# sourceMappingURL=create-estudiante.dto.js.map