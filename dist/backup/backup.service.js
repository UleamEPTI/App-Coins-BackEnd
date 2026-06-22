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
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs = require("fs");
const path = require("path");
let BackupService = BackupService_1 = class BackupService {
    dataSource;
    logger = new common_1.Logger(BackupService_1.name);
    backupDir = path.join(process.cwd(), 'backups');
    constructor(dataSource) {
        this.dataSource = dataSource;
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }
    async backupAutomatico() {
        this.logger.log('🔄 Iniciando backup automático...');
        await this.generarBackup('automatico');
    }
    async generarBackup(tipo = 'manual') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup_${tipo}_${timestamp}.json`;
        const filepath = path.join(this.backupDir, filename);
        const tablas = [
            'roles', 'instituciones', 'usuarios', 'cursos',
            'estudiantes', 'premios', 'tipos_botella',
            'historial_puntos', 'canjes', 'reciclajes', 'auditoria',
        ];
        const backup = {
            metadata: {
                fecha: new Date().toISOString(),
                tipo,
                version: '1.0',
            },
        };
        let totalRegistros = 0;
        for (const tabla of tablas) {
            try {
                const datos = await this.dataSource.query(`SELECT * FROM ${tabla}`);
                backup[tabla] = datos;
                totalRegistros += datos.length;
                this.logger.log(`✅ ${tabla}: ${datos.length} registros`);
            }
            catch (error) {
                this.logger.warn(`⚠️ Tabla ${tabla} no encontrada, omitiendo...`);
                backup[tabla] = [];
            }
        }
        fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
        this.logger.log(`✅ Backup completado: ${filename}`);
        this.limpiarBackupsAntiguos();
        return {
            mensaje: `Backup ${tipo} generado exitosamente`,
            archivo: filename,
            tablas: tablas.length,
            registros: totalRegistros,
        };
    }
    async listarBackups() {
        if (!fs.existsSync(this.backupDir))
            return [];
        const archivos = fs.readdirSync(this.backupDir)
            .filter(f => f.endsWith('.json'))
            .map(archivo => {
            const stats = fs.statSync(path.join(this.backupDir, archivo));
            return {
                archivo,
                size: `${(stats.size / 1024).toFixed(2)} KB`,
                fecha: stats.mtime.toISOString(),
            };
        })
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        return archivos;
    }
    limpiarBackupsAntiguos() {
        const archivos = fs.readdirSync(this.backupDir)
            .filter(f => f.endsWith('.json'))
            .map(f => ({ nombre: f, fecha: fs.statSync(path.join(this.backupDir, f)).mtime }))
            .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
        if (archivos.length > 10) {
            archivos.slice(10).forEach(f => {
                fs.unlinkSync(path.join(this.backupDir, f.nombre));
                this.logger.log(`🗑️ Backup antiguo eliminado: ${f.nombre}`);
            });
        }
    }
};
exports.BackupService = BackupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupService.prototype, "backupAutomatico", null);
exports.BackupService = BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], BackupService);
//# sourceMappingURL=backup.service.js.map