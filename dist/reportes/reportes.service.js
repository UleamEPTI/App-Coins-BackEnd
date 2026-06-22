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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const estudiante_entity_1 = require("../estudiantes/entities/estudiante.entity");
const reciclaje_entity_1 = require("../reciclajes/entities/reciclaje.entity");
const canje_entity_1 = require("../canjes/entities/canje.entity");
const PDFDocument = require('pdfkit');
let ReportesService = class ReportesService {
    estudianteRepository;
    reciclajeRepository;
    canjeRepository;
    constructor(estudianteRepository, reciclajeRepository, canjeRepository) {
        this.estudianteRepository = estudianteRepository;
        this.reciclajeRepository = reciclajeRepository;
        this.canjeRepository = canjeRepository;
    }
    async generarReporteInstitucion(institucion_id) {
        const estudiantes = await this.estudianteRepository
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.usuario', 'u')
            .leftJoinAndSelect('e.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .andWhere('e.activo = true')
            .orderBy('e.puntos', 'DESC')
            .getMany();
        const reciclajes = await this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.tipo_botella', 'tb')
            .leftJoin('r.estudiante', 'e')
            .leftJoin('e.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .getMany();
        const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
        const totalPuntos = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);
        const botellaPorTipo = {};
        reciclajes.forEach(r => {
            const tamano = r.tipo_botella?.tamano ?? 'desconocido';
            botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
        });
        return this.generarPDF({
            titulo: 'Reporte de Institución',
            totalEstudiantes: estudiantes.length,
            totalBotellas,
            totalPuntos,
            botellaPorTipo,
            estudiantes: estudiantes.map((e, i) => ({
                posicion: i + 1,
                nombre: `${e.usuario?.nombres ?? ''} ${e.usuario?.apellidos ?? ''}`,
                curso: `${e.curso?.nombre ?? ''} ${e.curso?.paralelo ?? ''}`,
                codigo: e.codigo_estudiante ?? '-',
                puntos: e.puntos,
            })),
        });
    }
    async generarReporteCurso(curso_id) {
        const estudiantes = await this.estudianteRepository
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.usuario', 'u')
            .leftJoinAndSelect('e.curso', 'c')
            .where('e.curso_id = :curso_id', { curso_id })
            .andWhere('e.activo = true')
            .orderBy('e.puntos', 'DESC')
            .getMany();
        const reciclajes = await this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.tipo_botella', 'tb')
            .leftJoin('r.estudiante', 'e')
            .where('e.curso_id = :curso_id', { curso_id })
            .getMany();
        const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
        const totalPuntos = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);
        const botellaPorTipo = {};
        reciclajes.forEach(r => {
            const tamano = r.tipo_botella?.tamano ?? 'desconocido';
            botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
        });
        const curso = estudiantes[0]?.curso;
        return this.generarPDF({
            titulo: `Reporte de Curso: ${curso?.nombre ?? ''} ${curso?.paralelo ?? ''}`,
            totalEstudiantes: estudiantes.length,
            totalBotellas,
            totalPuntos,
            botellaPorTipo,
            estudiantes: estudiantes.map((e, i) => ({
                posicion: i + 1,
                nombre: `${e.usuario?.nombres ?? ''} ${e.usuario?.apellidos ?? ''}`,
                codigo: e.codigo_estudiante ?? '-',
                puntos: e.puntos,
            })),
        });
    }
    generarPDF(data) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(20).font('Helvetica-Bold').text(data.titulo, { align: 'center' });
            doc.fontSize(11).font('Helvetica').text(`Fecha: ${new Date().toLocaleDateString('es-EC')}`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            doc.text(`Total Estudiantes: ${data.totalEstudiantes}`);
            doc.text(`Total Botellas Recicladas: ${data.totalBotellas}`);
            doc.text(`Total Puntos Generados: ${data.totalPuntos}`);
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('Botellas por Tipo');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            Object.entries(data.botellaPorTipo).forEach(([tamano, cantidad]) => {
                doc.text(`${tamano}: ${cantidad} botellas`);
            });
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('Ranking de Estudiantes');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('#', 50, doc.y, { continued: true, width: 40 });
            doc.text('Nombre', { continued: true, width: 180 });
            if (data.estudiantes[0]?.curso !== undefined) {
                doc.text('Curso', { continued: true, width: 120 });
            }
            doc.text('Código', { continued: true, width: 100 });
            doc.text('Puntos', { width: 60 });
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(10);
            data.estudiantes.forEach(e => {
                doc.text(`${e.posicion}`, 50, doc.y, { continued: true, width: 40 });
                doc.text(e.nombre, { continued: true, width: 180 });
                if (e.curso !== undefined) {
                    doc.text(e.curso, { continued: true, width: 120 });
                }
                doc.text(e.codigo, { continued: true, width: 100 });
                doc.text(`${e.puntos}`, { width: 60 });
            });
            doc.end();
        });
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __param(1, (0, typeorm_1.InjectRepository)(reciclaje_entity_1.Reciclaje)),
    __param(2, (0, typeorm_1.InjectRepository)(canje_entity_1.Canje)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map