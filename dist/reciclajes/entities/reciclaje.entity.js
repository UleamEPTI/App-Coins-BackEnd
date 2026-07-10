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
exports.Reciclaje = void 0;
const typeorm_1 = require("typeorm");
const curso_entity_1 = require("../../cursos/entities/curso.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
let Reciclaje = class Reciclaje {
    id;
    curso;
    registrado_por;
    kilos;
    puntos_ganados;
    created_at;
};
exports.Reciclaje = Reciclaje;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reciclaje.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_entity_1.Curso),
    (0, typeorm_1.JoinColumn)({ name: 'curso_id' }),
    __metadata("design:type", curso_entity_1.Curso)
], Reciclaje.prototype, "curso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'registrado_por' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Reciclaje.prototype, "registrado_por", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Reciclaje.prototype, "kilos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'puntos_ganados' }),
    __metadata("design:type", Number)
], Reciclaje.prototype, "puntos_ganados", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Reciclaje.prototype, "created_at", void 0);
exports.Reciclaje = Reciclaje = __decorate([
    (0, typeorm_1.Entity)('reciclajes')
], Reciclaje);
//# sourceMappingURL=reciclaje.entity.js.map