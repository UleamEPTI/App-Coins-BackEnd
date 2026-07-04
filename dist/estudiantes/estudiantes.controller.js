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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudiantesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const estudiantes_service_1 = require("./estudiantes.service");
const create_estudiante_dto_1 = require("./dto/create-estudiante.dto");
let EstudiantesController = class EstudiantesController {
    estudiantesService;
    constructor(estudiantesService) {
        this.estudiantesService = estudiantesService;
    }
    create(dto) {
        return this.estudiantesService.create(dto);
    }
    findAll(search, curso_id, institucion_id, activo, page, limit, sort, order) {
        return this.estudiantesService.findAll({
            search,
            curso_id,
            institucion_id,
            activo: activo !== undefined ? activo === 'true' : undefined,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
            sort,
            order,
        });
    }
    findOne(id) {
        return this.estudiantesService.findOne(id);
    }
    update(id, dto) {
        return this.estudiantesService.update(id, dto);
    }
    remove(id) {
        return this.estudiantesService.remove(id);
    }
};
exports.EstudiantesController = EstudiantesController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear estudiante' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_estudiante_dto_1.CreateEstudianteDto]),
    __metadata("design:returntype", void 0)
], EstudiantesController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar estudiantes con filtros y paginación' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Buscar por nombre, apellido o código' }),
    (0, swagger_1.ApiQuery)({ name: 'curso_id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'institucion_id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'activo', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, enum: ['apellidos', 'puntos', 'created_at', 'codigo_estudiante'] }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('curso_id')),
    __param(2, (0, common_1.Query)('institucion_id')),
    __param(3, (0, common_1.Query)('activo')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __param(6, (0, common_1.Query)('sort')),
    __param(7, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], EstudiantesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver un estudiante' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstudiantesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar estudiante' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EstudiantesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar estudiante' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstudiantesController.prototype, "remove", null);
exports.EstudiantesController = EstudiantesController = __decorate([
    (0, swagger_1.ApiTags)('Estudiantes'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('estudiantes'),
    __metadata("design:paramtypes", [estudiantes_service_1.EstudiantesService])
], EstudiantesController);
//# sourceMappingURL=estudiantes.controller.js.map