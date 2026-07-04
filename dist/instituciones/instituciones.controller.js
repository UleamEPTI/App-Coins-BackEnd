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
exports.InstitucionesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const instituciones_service_1 = require("./instituciones.service");
const create_institucion_dto_1 = require("./dto/create-institucion.dto");
let InstitucionesController = class InstitucionesController {
    institucionesService;
    constructor(institucionesService) {
        this.institucionesService = institucionesService;
    }
    create(dto, req) {
        return this.institucionesService.create(dto, req.user.id, req.user.email, req.ip);
    }
    findAll(search, activo, page, limit, sort, order) {
        return this.institucionesService.findAll({
            search,
            activo: activo !== undefined ? activo === 'true' : undefined,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
            sort,
            order,
        });
    }
    findOne(id) {
        return this.institucionesService.findOne(id);
    }
    update(id, dto, req) {
        return this.institucionesService.update(id, dto, req.user.id, req.user.email, req.ip);
    }
    remove(id, req) {
        return this.institucionesService.remove(id, req.user.id, req.user.email, req.ip);
    }
};
exports.InstitucionesController = InstitucionesController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear institución (ADMIN)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_institucion_dto_1.CreateInstitucionDto, Object]),
    __metadata("design:returntype", void 0)
], InstitucionesController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar instituciones con filtros y paginación' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'activo', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, enum: ['nombre', 'created_at', 'codigo'] }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('activo')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('sort')),
    __param(5, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], InstitucionesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION', 'DOCENTE'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver institución por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstitucionesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'INSTITUCION'),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar institución' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], InstitucionesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar institución (ADMIN)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InstitucionesController.prototype, "remove", null);
exports.InstitucionesController = InstitucionesController = __decorate([
    (0, swagger_1.ApiTags)('Instituciones'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('instituciones'),
    __metadata("design:paramtypes", [instituciones_service_1.InstitucionesService])
], InstitucionesController);
//# sourceMappingURL=instituciones.controller.js.map