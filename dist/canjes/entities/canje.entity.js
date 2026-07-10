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
exports.Canje = exports.EstadoCanje = void 0;
const typeorm_1 = require("typeorm");
const curso_entity_1 = require("../../cursos/entities/curso.entity");
const premio_entity_1 = require("../../premios/entities/premio.entity");
var EstadoCanje;
(function (EstadoCanje) {
    EstadoCanje["PENDIENTE"] = "PENDIENTE";
    EstadoCanje["ENTREGADO"] = "ENTREGADO";
    EstadoCanje["CANCELADO"] = "CANCELADO";
})(EstadoCanje || (exports.EstadoCanje = EstadoCanje = {}));
let Canje = class Canje {
    id;
    curso;
    premio;
    puntos_gastados;
    estado;
    created_at;
};
exports.Canje = Canje;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Canje.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso),
    (0, typeorm_1.JoinColumn)({ name: 'curso_id' }),
    __metadata("design:type", curso_entity_1.Curso)
], Canje.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => premio_entity_1.Premio),
    (0, typeorm_1.JoinColumn)({ name: 'premio_id' }),
    __metadata("design:type", premio_entity_1.Premio)
], Canje.prototype, "premio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'puntos_gastados' }),
    __metadata("design:type", Number)
], Canje.prototype, "puntos_gastados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoCanje, default: EstadoCanje.PENDIENTE }),
    __metadata("design:type", String)
], Canje.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Canje.prototype, "created_at", void 0);
exports.Canje = Canje = __decorate([
    (0, typeorm_1.Entity)('canjes')
], Canje);
//# sourceMappingURL=canje.entity.js.map