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
exports.SolicitudPassword = exports.EstadoSolicitud = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
var EstadoSolicitud;
(function (EstadoSolicitud) {
    EstadoSolicitud["PENDIENTE"] = "PENDIENTE";
    EstadoSolicitud["ATENDIDA"] = "ATENDIDA";
    EstadoSolicitud["RECHAZADA"] = "RECHAZADA";
})(EstadoSolicitud || (exports.EstadoSolicitud = EstadoSolicitud = {}));
let SolicitudPassword = class SolicitudPassword {
    id;
    solicitado_por;
    usuario_objetivo;
    estado;
    mensaje;
    created_at;
    updated_at;
};
exports.SolicitudPassword = SolicitudPassword;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SolicitudPassword.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'solicitado_por' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], SolicitudPassword.prototype, "solicitado_por", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_objetivo' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], SolicitudPassword.prototype, "usuario_objetivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: EstadoSolicitud.PENDIENTE }),
    __metadata("design:type", String)
], SolicitudPassword.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SolicitudPassword.prototype, "mensaje", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SolicitudPassword.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SolicitudPassword.prototype, "updated_at", void 0);
exports.SolicitudPassword = SolicitudPassword = __decorate([
    (0, typeorm_1.Entity)('solicitudes_password')
], SolicitudPassword);
//# sourceMappingURL=solicitud-password.entity.js.map