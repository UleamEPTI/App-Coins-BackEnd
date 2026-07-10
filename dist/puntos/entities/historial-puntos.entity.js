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
exports.HistorialPuntos = exports.TipoTransaccion = void 0;
const typeorm_1 = require("typeorm");
const curso_entity_1 = require("../../cursos/entities/curso.entity");
var TipoTransaccion;
(function (TipoTransaccion) {
    TipoTransaccion["SUMA"] = "SUMA";
    TipoTransaccion["RESTA"] = "RESTA";
    TipoTransaccion["CANJE"] = "CANJE";
})(TipoTransaccion || (exports.TipoTransaccion = TipoTransaccion = {}));
let HistorialPuntos = class HistorialPuntos {
    id;
    curso;
    tipo;
    puntos;
    descripcion;
    created_at;
};
exports.HistorialPuntos = HistorialPuntos;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], HistorialPuntos.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso),
    (0, typeorm_1.JoinColumn)({ name: 'curso_id' }),
    __metadata("design:type", curso_entity_1.Curso)
], HistorialPuntos.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TipoTransaccion }),
    __metadata("design:type", String)
], HistorialPuntos.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], HistorialPuntos.prototype, "puntos", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HistorialPuntos.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], HistorialPuntos.prototype, "created_at", void 0);
exports.HistorialPuntos = HistorialPuntos = __decorate([
    (0, typeorm_1.Entity)('historial_puntos')
], HistorialPuntos);
//# sourceMappingURL=historial-puntos.entity.js.map