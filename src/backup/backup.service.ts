import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups');

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    // Crear carpeta backups si no existe
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // Backup automático cada día a las 2am
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async backupAutomatico() {
    this.logger.log('🔄 Iniciando backup automático...');
    await this.generarBackup('automatico');
  }

  async generarBackup(tipo: 'manual' | 'automatico' = 'manual'): Promise<{ mensaje: string; archivo: string; tablas: number; registros: number }> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${tipo}_${timestamp}.json`;
    const filepath = path.join(this.backupDir, filename);

    const tablas = [
      'roles', 'instituciones', 'usuarios', 'cursos',
      'estudiantes', 'premios', 'tipos_botella',
      'historial_puntos', 'canjes', 'reciclajes', 'auditoria',
    ];

    const backup: Record<string, any[]> = {
      metadata: {
        fecha: new Date().toISOString(),
        tipo,
        version: '1.0',
      } as any,
    };

    let totalRegistros = 0;

    for (const tabla of tablas) {
      try {
        const datos = await this.dataSource.query(`SELECT * FROM ${tabla}`);
        backup[tabla] = datos;
        totalRegistros += datos.length;
        this.logger.log(`✅ ${tabla}: ${datos.length} registros`);
      } catch (error) {
        this.logger.warn(`⚠️ Tabla ${tabla} no encontrada, omitiendo...`);
        backup[tabla] = [];
      }
    }

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
    this.logger.log(`✅ Backup completado: ${filename}`);

    // Limpiar backups antiguos (mantener solo los últimos 10)
    this.limpiarBackupsAntiguos();

    return {
      mensaje: `Backup ${tipo} generado exitosamente`,
      archivo: filename,
      tablas: tablas.length,
      registros: totalRegistros,
    };
  }

  async listarBackups(): Promise<{ archivo: string; size: string; fecha: string }[]> {
    if (!fs.existsSync(this.backupDir)) return [];

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

  private limpiarBackupsAntiguos() {
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
}