import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Canje } from '../canjes/entities/canje.entity';
const PDFDocument = require('pdfkit');

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Reciclaje)
    private readonly reciclajeRepository: Repository<Reciclaje>,
    @InjectRepository(Canje)
    private readonly canjeRepository: Repository<Canje>,
  ) {}

  async generarReporteInstitucion(institucion_id: string): Promise<Buffer> {
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

    const botellaPorTipo: Record<string, number> = {};
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

  async generarReporteCurso(curso_id: string): Promise<Buffer> {
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

    const botellaPorTipo: Record<string, number> = {};
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

  private generarPDF(data: {
    titulo: string;
    totalEstudiantes: number;
    totalBotellas: number;
    totalPuntos: number;
    botellaPorTipo: Record<string, number>;
    estudiantes: { posicion: number; nombre: string; curso?: string; codigo: string; puntos: number }[];
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Título
      doc.fontSize(20).font('Helvetica-Bold').text(data.titulo, { align: 'center' });
      doc.fontSize(11).font('Helvetica').text(`Fecha: ${new Date().toLocaleDateString('es-EC')}`, { align: 'center' });
      doc.moveDown();

      // Resumen
      doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Total Estudiantes: ${data.totalEstudiantes}`);
      doc.text(`Total Botellas Recicladas: ${data.totalBotellas}`);
      doc.text(`Total Puntos Generados: ${data.totalPuntos}`);
      doc.moveDown();

      // Botellas por tipo
      doc.fontSize(14).font('Helvetica-Bold').text('Botellas por Tipo');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      Object.entries(data.botellaPorTipo).forEach(([tamano, cantidad]) => {
        doc.text(`${tamano}: ${cantidad} botellas`);
      });
      doc.moveDown();

      // Ranking
      doc.fontSize(14).font('Helvetica-Bold').text('Ranking de Estudiantes');
      doc.moveDown(0.5);

      // Encabezado tabla
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

      // Filas
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
}