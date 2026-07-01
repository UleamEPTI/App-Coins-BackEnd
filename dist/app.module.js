"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth/auth.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const estudiantes_module_1 = require("./estudiantes/estudiantes.module");
const premios_module_1 = require("./premios/premios.module");
const puntos_module_1 = require("./puntos/puntos.module");
const canjes_module_1 = require("./canjes/canjes.module");
const instituciones_module_1 = require("./instituciones/instituciones.module");
const estadisticas_module_1 = require("./estadisticas/estadisticas.module");
const auditoria_module_1 = require("./auditoria/auditoria.module");
const tipos_botella_module_1 = require("./tipos-botella/tipos-botella.module");
const reciclajes_module_1 = require("./reciclajes/reciclajes.module");
const reportes_module_1 = require("./reportes/reportes.module");
const backup_module_1 = require("./backup/backup.module");
const solicitudes_password_module_1 = require("./solicitudes-password/solicitudes-password.module");
const cursos_module_1 = require("./cursos/cursos.module");
const version_module_1 = require("./version/version.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST') ?? 'localhost',
                    port: parseInt(configService.get('DB_PORT') ?? '5432'),
                    username: configService.get('DB_USERNAME') ?? 'postgres',
                    password: configService.get('DB_PASSWORD') ?? '',
                    database: configService.get('DB_NAME') ?? 'bachillero_db',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: false,
                    extra: {
                        max: 20,
                        min: 2,
                        idleTimeoutMillis: 30000,
                    }
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            usuarios_module_1.UsuariosModule,
            estudiantes_module_1.EstudiantesModule,
            premios_module_1.PremiosModule,
            puntos_module_1.PuntosModule,
            canjes_module_1.CanjesModule,
            instituciones_module_1.InstitucionesModule,
            estadisticas_module_1.EstadisticasModule,
            auditoria_module_1.AuditoriaModule,
            tipos_botella_module_1.TiposBotellaModule,
            reciclajes_module_1.ReciclajesModule,
            reportes_module_1.ReportesModule,
            backup_module_1.BackupModule,
            solicitudes_password_module_1.SolicitudesPasswordModule,
            cursos_module_1.CursosModule,
            version_module_1.VersionModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map