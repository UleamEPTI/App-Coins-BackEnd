import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
// COMENTADO: antes usaba Estudiante y Canje, ahora usa Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';
// import { Canje } from '../canjes/entities/canje.entity';
const PDFDocument = require('pdfkit');

export type PeriodoReporte = 'semana' | 'mes' | 'anio';

// NUEVO: helper para el filtro de reportes por rango de fecha que pidió
// la institución (basado en la fecha de creación existente).
function fechaInicioPeriodo(periodo?: PeriodoReporte): Date | null {
  if (!periodo) return null;
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

@Injectable()
export class ReportesService {
  constructor(
    // COMENTADO: antes inyectaba Estudiante.
    // @InjectRepository(Estudiante)
    // private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Reciclaje)
    private readonly reciclajeRepository: Repository<Reciclaje>,
    // COMENTADO: canjeRepository no se usaba realmente en la generación del PDF.
    // @InjectRepository(Canje)
    // private readonly canjeRepository: Repository<Canje>,
  ) {}

  async generarReporteInstitucion(institucion_id: string, periodo?: PeriodoReporte): Promise<Buffer> {
    // COMENTADO (versión anterior, por estudiante):
    // const estudiantes = await this.estudianteRepository
    //   .createQueryBuilder('e')
    //   .leftJoinAndSelect('e.usuario', 'u')
    //   .leftJoinAndSelect('e.curso', 'c')
    //   .where('c.institucion_id = :institucion_id', { institucion_id })
    //   .andWhere('e.activo = true')
    //   .orderBy('e.puntos', 'DESC')
    //   .getMany();
    const cursos = await this.cursoRepository
      .createQueryBuilder('c')
      .where('c.institucion_id = :institucion_id', { institucion_id })
      .andWhere('c.activo = true')
      .orderBy('c.puntos', 'DESC')
      .getMany();

    // COMENTADO (versión anterior, por estudiante, con tipo_botella):
    // const reciclajes = await this.reciclajeRepository
    //   .createQueryBuilder('r')
    //   .leftJoinAndSelect('r.tipo_botella', 'tb')
    //   .leftJoin('r.estudiante', 'e')
    //   .leftJoin('e.curso', 'c')
    //   .where('c.institucion_id = :institucion_id', { institucion_id })
    //   .getMany();
    //
    // NUEVO: filtro por periodo (semana/mes/año) sobre la fecha de creación.
    const desde = fechaInicioPeriodo(periodo);
    const reciclajesQuery = this.reciclajeRepository
      .createQueryBuilder('r')
      .leftJoin('r.curso', 'c')
      .where('c.institucion_id = :institucion_id', { institucion_id });
    if (desde) reciclajesQuery.andWhere('r.created_at >= :desde', { desde });
    const reciclajes = await reciclajesQuery.getMany();

    // COMENTADO: const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
    const totalKilos = reciclajes.reduce((sum, r) => sum + r.kilos, 0);
    const totalPuntos = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);

    // COMENTADO: ya no hay tipos de botella.
    // const botellaPorTipo: Record<string, number> = {};
    // reciclajes.forEach(r => {
    //   const tamano = r.tipo_botella?.tamano ?? 'desconocido';
    //   botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
    // });

    return this.generarPDF({
      titulo: 'Reporte de Institución',
      periodo,
      // COMENTADO: totalEstudiantes: estudiantes.length,
      totalCursos: cursos.length,
      // COMENTADO: totalBotellas,
      totalKilos,
      totalPuntos,
      // COMENTADO: botellaPorTipo,
      // COMENTADO (versión anterior, por estudiante):
      // estudiantes: estudiantes.map((e, i) => ({
      //   posicion: i + 1,
      //   nombre: `${e.usuario?.nombres ?? ''} ${e.usuario?.apellidos ?? ''}`,
      //   curso: `${e.curso?.nombre ?? ''} ${e.curso?.paralelo ?? ''}`,
      //   codigo: e.codigo_estudiante ?? '-',
      //   puntos: e.puntos,
      // })),
      cursos: cursos.map((c, i) => ({
        posicion: i + 1,
        nombre: `${c.nombre ?? ''} ${c.paralelo ?? ''}`.trim(),
        puntos: c.puntos,
      })),
    });
  }

  async generarReporteCurso(curso_id: string, periodo?: PeriodoReporte): Promise<Buffer> {
    // COMENTADO (versión anterior, por estudiante dentro de un curso):
    // const estudiantes = await this.estudianteRepository
    //   .createQueryBuilder('e')
    //   .leftJoinAndSelect('e.usuario', 'u')
    //   .leftJoinAndSelect('e.curso', 'c')
    //   .where('e.curso_id = :curso_id', { curso_id })
    //   .andWhere('e.activo = true')
    //   .orderBy('e.puntos', 'DESC')
    //   .getMany();
    const curso = await this.cursoRepository.findOne({ where: { id: curso_id } });

    // COMENTADO (versión anterior, con tipo_botella):
    // const reciclajes = await this.reciclajeRepository
    //   .createQueryBuilder('r')
    //   .leftJoinAndSelect('r.tipo_botella', 'tb')
    //   .leftJoin('r.estudiante', 'e')
    //   .where('e.curso_id = :curso_id', { curso_id })
    //   .getMany();
    const desde = fechaInicioPeriodo(periodo);
    const reciclajesQuery = this.reciclajeRepository
      .createQueryBuilder('r')
      .where('r.curso_id = :curso_id', { curso_id });
    if (desde) reciclajesQuery.andWhere('r.created_at >= :desde', { desde });
    const reciclajes = await reciclajesQuery.getMany();

    // COMENTADO: const totalBotellas = reciclajes.reduce((sum, r) => sum + r.cantidad, 0);
    const totalKilos = reciclajes.reduce((sum, r) => sum + r.kilos, 0);
    const totalPuntos = reciclajes.reduce((sum, r) => sum + r.puntos_ganados, 0);

    // COMENTADO: ya no hay tipos de botella.
    // const botellaPorTipo: Record<string, number> = {};
    // reciclajes.forEach(r => {
    //   const tamano = r.tipo_botella?.tamano ?? 'desconocido';
    //   botellaPorTipo[tamano] = (botellaPorTipo[tamano] ?? 0) + r.cantidad;
    // });

    // COMENTADO: const curso = estudiantes[0]?.curso;

    return this.generarPDF({
      titulo: `Reporte de Curso: ${curso?.nombre ?? ''} ${curso?.paralelo ?? ''}`.trim(),
      periodo,
      // COMENTADO: totalEstudiantes: estudiantes.length,
      totalCursos: 1,
      // COMENTADO: totalBotellas,
      totalKilos,
      totalPuntos,
      // COMENTADO: botellaPorTipo,
      // COMENTADO (versión anterior, por estudiante):
      // estudiantes: estudiantes.map((e, i) => ({
      //   posicion: i + 1,
      //   nombre: `${e.usuario?.nombres ?? ''} ${e.usuario?.apellidos ?? ''}`,
      //   codigo: e.codigo_estudiante ?? '-',
      //   puntos: e.puntos,
      // })),
      cursos: [{ posicion: 1, nombre: `${curso?.nombre ?? ''} ${curso?.paralelo ?? ''}`.trim(), puntos: curso?.puntos ?? 0 }],
    });
  }

  private generarPDF(data: {
    titulo: string;
    periodo?: PeriodoReporte;
    totalCursos: number;
    totalKilos: number;
    totalPuntos: number;
    cursos: { posicion: number; nombre: string; puntos: number }[];
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const periodoTexto = { semana: 'Última semana', mes: 'Último mes', anio: 'Último año' };

      // Título
      doc.fontSize(20).font('Helvetica-Bold').text(data.titulo, { align: 'center' });
      doc.fontSize(11).font('Helvetica').text(`Fecha: ${new Date().toLocaleDateString('es-EC')}`, { align: 'center' });
      if (data.periodo) {
        doc.text(`Periodo: ${periodoTexto[data.periodo]}`, { align: 'center' });
      }
      doc.moveDown();

      // Resumen
      doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      // COMENTADO: doc.text(`Total Estudiantes: ${data.totalEstudiantes}`);
      doc.text(`Total Cursos: ${data.totalCursos}`);
      // COMENTADO: doc.text(`Total Botellas Recicladas: ${data.totalBotellas}`);
      doc.text(`Total Kilos Reciclados: ${data.totalKilos}`);
      doc.text(`Total Puntos Generados: ${data.totalPuntos}`);
      doc.moveDown();

      // COMENTADO: bloque de "Botellas por Tipo", ya no aplica.
      // doc.fontSize(14).font('Helvetica-Bold').text('Botellas por Tipo');
      // doc.moveDown(0.5);
      // doc.fontSize(11).font('Helvetica');
      // Object.entries(data.botellaPorTipo).forEach(([tamano, cantidad]) => {
      //   doc.text(`${tamano}: ${cantidad} botellas`);
      // });
      // doc.moveDown();

      // Tabla de cursos (antes era "Ranking de Estudiantes")
      doc.fontSize(14).font('Helvetica-Bold').text('Detalle por Curso');
      doc.moveDown(0.5);

      doc.fontSize(11).font('Helvetica-Bold');
      doc.text('#', 50, doc.y, { continued: true, width: 40 });
      // COMENTADO: encabezado anterior tenía Nombre/Curso/Código/Puntos.
      // doc.text('Nombre', { continued: true, width: 180 });
      // if (data.estudiantes[0]?.curso !== undefined) {
      //   doc.text('Curso', { continued: true, width: 120 });
      // }
      // doc.text('Código', { continued: true, width: 100 });
      doc.text('Curso', { continued: true, width: 300 });
      doc.text('Puntos', { width: 100 });

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);

      // Filas
      doc.font('Helvetica').fontSize(10);
      data.cursos.forEach(c => {
        doc.text(`${c.posicion}`, 50, doc.y, { continued: true, width: 40 });
        // COMENTADO: filas anteriores mostraban nombre/curso/código de estudiante.
        // doc.text(e.nombre, { continued: true, width: 180 });
        // if (e.curso !== undefined) {
        //   doc.text(e.curso, { continued: true, width: 120 });
        // }
        // doc.text(e.codigo, { continued: true, width: 100 });
        doc.text(c.nombre, { continued: true, width: 300 });
        doc.text(`${c.puntos}`, { width: 100 });
      });

      doc.end();
    });
  }
}