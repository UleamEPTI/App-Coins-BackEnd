"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposBotellaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tipo_botella_entity_1 = require("./entities/tipo-botella.entity");
const tipos_botella_service_1 = require("./tipos-botella.service");
const tipos_botella_controller_1 = require("./tipos-botella.controller");
let TiposBotellaModule = class TiposBotellaModule {
};
exports.TiposBotellaModule = TiposBotellaModule;
exports.TiposBotellaModule = TiposBotellaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tipo_botella_entity_1.TipoBotella])],
        providers: [tipos_botella_service_1.TiposBotellaService],
        controllers: [tipos_botella_controller_1.TiposBotellaController],
        exports: [tipos_botella_service_1.TiposBotellaService],
    })
], TiposBotellaModule);
//# sourceMappingURL=tipos-botella.module.js.map