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
const curso_entity_1 = require("../cursos/entities/curso.entity");
const reciclaje_entity_1 = require("../reciclajes/entities/reciclaje.entity");
const PDFDocument = require('pdfkit');
function fechaInicioPeriodo(periodo) {
    if (!periodo)
        return null;
    const ahora = new Date();
    if (periodo === 'semana') {
        const inicio = new Date(ahora);
        inicio.setDate(ahora.getDate() - 7);
        return inicio;
    }
    if (periodo === 'mes') {
        const inicio = new Date(ahora);
        inicio.setMonth(ahora.getMonth() - 1);
        return inicio;
    }
    const inicio = new Date(ahora);
    inicio.setFullYear(ahora.getFullYear() - 1);
    return inicio;
}
let ReportesService = class ReportesService {
    cursoRepository;
    reciclajeRepository;
    constructor(cursoRepository, reciclajeRepository) {
        this.cursoRepository = cursoRepository;
        this.reciclajeRepository = reciclajeRepository;
    }
    async generarReporteInstitucion(institucion_id, periodo) {
        const cursos = await this.cursoRepository
            .createQueryBuilder('c')
            .where('c.institucion_id = :institucion_id', { institucion_id })
            .andWhere('c.activo = true')
            .orderBy('c.puntos', 'DESC')
            .getMany();
        const desde = fechaInicioPeriodo(periodo);
        const reciclajesQuery = this.reciclajeRepository
            .createQueryBuilder('r')
            .leftJoin('r.curso', 'c')
            .where('c.institucion_id = :institucion_id', { institucion_id });
        if (desde)
            reciclajesQuery.andWhere('r.created_at >= :desde', { desde });
        const reciclajes = await reciclajesQuery.getMany();
        const totalKilos = reciclajes.reduce((sum, r) => sum + r.kilos, 0);
        const totalPuntos = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);
        return this.generarPDF({
            titulo: 'Reporte de Institución',
            periodo,
            totalCursos: cursos.length,
            totalKilos,
            totalPuntos,
            cursos: cursos.map((c, i) => ({
                posicion: i + 1,
                nombre: `${c.nombre ?? ''} ${c.paralelo ?? ''}`.trim(),
                puntos: c.puntos,
            })),
        });
    }
    async generarReporteCurso(curso_id, periodo) {
        const curso = await this.cursoRepository.findOne({ where: { id: curso_id } });
        const desde = fechaInicioPeriodo(periodo);
        const reciclajesQuery = this.reciclajeRepository
            .createQueryBuilder('r')
            .where('r.curso_id = :curso_id', { curso_id });
        if (desde)
            reciclajesQuery.andWhere('r.created_at >= :desde', { desde });
        const reciclajes = await reciclajesQuery.getMany();
        const totalKilos = reciclajes.reduce((sum, r) => sum + r.kilos, 0);
        const totalPuntos = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);
        return this.generarPDF({
            titulo: `Reporte de Curso: ${curso?.nombre ?? ''} ${curso?.paralelo ?? ''}`.trim(),
            periodo,
            totalCursos: 1,
            totalKilos,
            totalPuntos,
            cursos: [{ posicion: 1, nombre: `${curso?.nombre ?? ''} ${curso?.paralelo ?? ''}`.trim(), puntos: curso?.puntos ?? 0 }],
        });
    }
    generarPDF(data) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            const periodoTexto = { semana: 'Última semana', mes: 'Último mes', anio: 'Último año' };
            doc.fontSize(20).font('Helvetica-Bold').text(data.titulo, { align: 'center' });
            doc.fontSize(11).font('Helvetica').text(`Fecha: ${new Date().toLocaleDateString('es-EC')}`, { align: 'center' });
            if (data.periodo) {
                doc.text(`Periodo: ${periodoTexto[data.periodo]}`, { align: 'center' });
            }
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            doc.text(`Total Cursos: ${data.totalCursos}`);
            doc.text(`Total Kilos Reciclados: ${data.totalKilos}`);
            doc.text(`Total Puntos Generados: ${data.totalPuntos}`);
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('Detalle por Curso');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica-Bold');
            doc.text('#', 50, doc.y, { continued: true, width: 40 });
            doc.text('Curso', { continued: true, width: 300 });
            doc.text('Puntos', { width: 100 });
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.3);
            doc.font('Helvetica').fontSize(10);
            data.cursos.forEach(c => {
                doc.text(`${c.posicion}`, 50, doc.y, { continued: true, width: 40 });
                doc.text(c.nombre, { continued: true, width: 300 });
                doc.text(`${c.puntos}`, { width: 100 });
            });
            doc.end();
        });
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(curso_entity_1.Curso)),
    __param(1, (0, typeorm_1.InjectRepository)(reciclaje_entity_1.Reciclaje)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map