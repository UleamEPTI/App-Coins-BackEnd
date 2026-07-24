import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
// NUEVO: para consultar el nombre real de la institución y ponerlo en el título del reporte.
import { Institucion } from '../instituciones/entities/institucion.entity';
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
    // FIX: antes usaba `setMonth(ahora.getMonth() - 1)`, que en JavaScript
    // se desborda cuando el día actual no existe en el mes anterior (ej:
    // 31 de marzo - 1 mes debería dar ~28 de febrero, pero setMonth
    // desborda hacia el 3 de marzo). Eso recortaba silenciosamente el
    // rango de "último mes" a menos de un mes real. Se usa resta de días
    // fijos, igual que 'semana', para evitar el problema de calendario.
    const inicio = new Date(ahora);
    inicio.setDate(ahora.getDate() - 30);
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
    // NUEVO: para consultar el nombre real de la institución.
    @InjectRepository(Institucion)
    private readonly institucionRepository: Repository<Institucion>,
    // COMENTADO: canjeRepository no se usaba realmente en la generación del PDF.
    // @InjectRepository(Canje)
    // private readonly canjeRepository: Repository<Canje>,
  ) {}

  async generarReporteInstitucion(
    institucion_id: string,
    periodo?: PeriodoReporte,
    usuarioRol?: string,
    usuarioInstitucionId?: string | null,
  ): Promise<Buffer> {
    // NUEVO: si no es ADMIN y pide una institución que no es la suya, se niega.
    if (usuarioRol && usuarioRol !== 'ADMIN' && institucion_id !== usuarioInstitucionId) {
      throw new ForbiddenException('No tienes permiso para generar el reporte de esta institución');
    }

    // NUEVO: se consulta la institución para poner su nombre real en el
    // título del reporte (antes decía genéricamente "Reporte de Institución",
    // sin indicar de cuál institución se trataba).
    const institucion = await this.institucionRepository.findOne({ where: { id: institucion_id } });
    if (!institucion) throw new NotFoundException(`Institución ${institucion_id} no encontrada`);

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
      titulo: `Reporte de Institución: ${institucion.nombre}`,
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

  async generarReporteCurso(
    curso_id: string,
    periodo?: PeriodoReporte,
    usuarioRol?: string,
    usuarioInstitucionId?: string | null,
  ): Promise<Buffer> {
    // NUEVO: si no es ADMIN, valida que el curso pertenezca a su institución.
    if (usuarioRol && usuarioRol !== 'ADMIN') {
      const pertenece = await this.cursoRepository
        .createQueryBuilder('c')
        .where('c.id = :curso_id AND c.institucion_id = :institucion_id', { curso_id, institucion_id: usuarioInstitucionId })
        .getExists();
      if (!pertenece) throw new NotFoundException(`Curso ${curso_id} no encontrado`);
    }

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
      const doc = new PDFDocument({ margin: 48, bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // La composición visual vive en este método: no cambia consultas,
      // filtros ni la información que entrega cada reporte.
      const COLOR = {
        fondo: '#F6F9F6',
        superficie: '#FFFFFF',
        verdeProfundo: '#123D27',
        verde: '#1D7042',
        verdeClaro: '#E8F4EA',
        lima: '#87B93D',
        dorado: '#D99C2B',
        texto: '#193025',
        textoSuave: '#65756A',
        borde: '#D8E5DA',
        fila: '#FBFDFC',
      };

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const marginX = 48;
      const contentWidth = pageWidth - marginX * 2;
      const footerY = pageHeight - 38;
      const periodoTexto = { semana: 'Última semana', mes: 'Último mes', anio: 'Último año' };
      const fechaEmision = new Date().toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const formatearNumero = (valor: number, decimales = 0) =>
        new Intl.NumberFormat('es-EC', {
          maximumFractionDigits: decimales,
          minimumFractionDigits: 0,
        }).format(Number.isFinite(Number(valor)) ? Number(valor) : 0);

      const dibujarFondo = () => {
        doc.save();
        doc.rect(0, 0, pageWidth, pageHeight).fill(COLOR.fondo);
        doc.restore();
      };

      const dibujarEncabezadoPrincipal = () => {
        dibujarFondo();
        doc.rect(0, 0, pageWidth, 158).fill(COLOR.verdeProfundo);
        doc.save();
        doc.fillOpacity(0.1);
        doc.circle(pageWidth - 16, 12, 102).fill('#FFFFFF');
        doc.circle(pageWidth - 92, 138, 70).fill('#FFFFFF');
        doc.restore();

        doc.circle(marginX + 5, 26, 5).fill(COLOR.lima);
        doc
          .fillColor('#FFFFFF')
          .font('Helvetica-Bold')
          .fontSize(9)
          .text('APP COINS', marginX + 18, 20, { characterSpacing: 1.3 });
        doc
          .fillColor('#BBD8C1')
          .font('Helvetica')
          .fontSize(8)
          .text('REPORTE DE RECICLAJE', marginX + 18, 34, { characterSpacing: 0.7 });

        const tamanoTitulo = data.titulo.length > 48 ? 17 : data.titulo.length > 36 ? 19 : 22;
        doc
          .fillColor('#FFFFFF')
          .font('Helvetica-Bold')
          .fontSize(tamanoTitulo)
          .text(data.titulo, marginX, 59, {
            width: contentWidth,
            height: 42,
            ellipsis: true,
            lineGap: 0,
          });

        const periodo = data.periodo ? periodoTexto[data.periodo] : 'Histórico completo';
        const metadatos = 'Emitido el ' + fechaEmision + '  ·  ' + periodo;
        doc.save();
        doc.fillOpacity(0.14);
        doc.roundedRect(marginX, 119, Math.min(contentWidth, 330), 23, 11).fill('#FFFFFF');
        doc.restore();
        doc
          .fillColor('#E6F2E8')
          .font('Helvetica')
          .fontSize(8.5)
          .text(metadatos, marginX + 12, 126, { width: Math.min(contentWidth, 306) });
        doc.rect(0, 153, pageWidth, 5).fill(COLOR.lima);
      };

      const dibujarEncabezadoContinuacion = () => {
        dibujarFondo();
        doc.rect(0, 0, pageWidth, 6).fill(COLOR.lima);
        doc.circle(marginX + 5, 28, 4).fill(COLOR.verde);
        doc
          .fillColor(COLOR.verdeProfundo)
          .font('Helvetica-Bold')
          .fontSize(9)
          .text('APP COINS', marginX + 16, 22, { characterSpacing: 1.1 });
        doc
          .fillColor(COLOR.textoSuave)
          .font('Helvetica')
          .fontSize(8.5)
          .text('Detalle por curso · continuación', marginX, 43);
        doc.moveTo(marginX, 58).lineTo(pageWidth - marginX, 58).lineWidth(0.7).stroke(COLOR.borde);
      };

      const dibujarTarjeta = (
        x: number,
        y: number,
        ancho: number,
        colorAcento: string,
        etiqueta: string,
        valor: string,
        detalle: string,
      ) => {
        const alto = 84;
        doc.roundedRect(x, y, ancho, alto, 9).fillAndStroke(COLOR.superficie, COLOR.borde);
        doc.roundedRect(x, y, ancho, 5, 8).fill(colorAcento);
        doc
          .fillColor(COLOR.textoSuave)
          .font('Helvetica-Bold')
          .fontSize(7.5)
          .text(etiqueta.toUpperCase(), x + 15, y + 19, {
            width: ancho - 30,
            align: 'center',
            characterSpacing: 0.6,
          });
        doc
          .fillColor(COLOR.texto)
          .font('Helvetica-Bold')
          .fontSize(20)
          .text(valor, x + 12, y + 35, { width: ancho - 24, align: 'center', ellipsis: true });
        doc
          .fillColor(COLOR.textoSuave)
          .font('Helvetica')
          .fontSize(8)
          .text(detalle, x + 12, y + 62, { width: ancho - 24, align: 'center', ellipsis: true });
      };

      const tableX = marginX;
      const numeroWidth = 46;
      const puntosWidth = 116;
      const nombreX = tableX + numeroWidth + 12;
      const nombreWidth = contentWidth - numeroWidth - puntosWidth - 30;
      const tableHeaderHeight = 31;

      const dibujarCabeceraTabla = (y: number) => {
        doc.roundedRect(tableX, y, contentWidth, tableHeaderHeight, 7).fill(COLOR.verdeProfundo);
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#FFFFFF');
        doc.text('N.º', tableX + 14, y + 11, { width: numeroWidth - 14 });
        doc.text('CURSO', nombreX, y + 11, { width: nombreWidth, characterSpacing: 0.5 });
        doc.text('PUNTOS ACUMULADOS', tableX + contentWidth - puntosWidth, y + 11, {
          width: puntosWidth - 13,
          align: 'right',
          characterSpacing: 0.25,
        });
      };

      const dibujarFila = (y: number, posicion: number, nombre: string, puntos: number, alto: number, alterna: boolean) => {
        doc.rect(tableX, y, contentWidth, alto).fill(alterna ? COLOR.fila : COLOR.superficie);
        doc.moveTo(tableX, y + alto).lineTo(tableX + contentWidth, y + alto).lineWidth(0.55).stroke(COLOR.borde);

        const insigniaY = y + alto / 2 - 10;
        doc.circle(tableX + 22, insigniaY + 10, 10).fill(COLOR.verdeClaro);
        doc
          .fillColor(COLOR.verde)
          .font('Helvetica-Bold')
          .fontSize(8.5)
          .text(String(posicion), tableX + 12, insigniaY + 6.5, { width: 20, align: 'center' });
        doc
          .fillColor(COLOR.texto)
          .font('Helvetica')
          .fontSize(10)
          .text(nombre || 'Curso sin nombre', nombreX, y + 12, {
            width: nombreWidth,
            height: Math.max(16, alto - 20),
            ellipsis: true,
            lineGap: 1,
          });

        const chipWidth = 76;
        const chipX = tableX + contentWidth - chipWidth - 14;
        const chipY = y + alto / 2 - 11;
        doc.roundedRect(chipX, chipY, chipWidth, 22, 11).fill(COLOR.verdeClaro);
        doc
          .fillColor(COLOR.verdeProfundo)
          .font('Helvetica-Bold')
          .fontSize(9)
          .text(formatearNumero(puntos), chipX, chipY + 6.5, {
            width: chipWidth,
            align: 'center',
            ellipsis: true,
          });
      };

      dibujarEncabezadoPrincipal();

      const resumenY = 183;
      doc.rect(marginX, resumenY + 3, 4, 18).fill(COLOR.lima);
      doc
        .fillColor(COLOR.texto)
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Resumen general', marginX + 13, resumenY);
      doc
        .fillColor(COLOR.textoSuave)
        .font('Helvetica')
        .fontSize(8.5)
        .text('Indicadores consolidados del reporte', marginX + 13, resumenY + 18);

      const gap = 12;
      const cardWidth = (contentWidth - gap * 2) / 3;
      const cardY = 231;
      dibujarTarjeta(
        marginX,
        cardY,
        cardWidth,
        COLOR.verde,
        'Cursos incluidos',
        formatearNumero(data.totalCursos),
        'en el presente reporte',
      );
      dibujarTarjeta(
        marginX + cardWidth + gap,
        cardY,
        cardWidth,
        COLOR.lima,
        'Kilos reciclados',
        formatearNumero(data.totalKilos, 2) + ' kg',
        'peso registrado en el período',
      );
      dibujarTarjeta(
        marginX + (cardWidth + gap) * 2,
        cardY,
        cardWidth,
        COLOR.dorado,
        'Puntos generados',
        formatearNumero(data.totalPuntos),
        'puntos obtenidos en el período',
      );

      let y = cardY + 116;
      doc.rect(marginX, y + 3, 4, 18).fill(COLOR.lima);
      doc.fillColor(COLOR.texto).font('Helvetica-Bold').fontSize(14).text('Detalle por curso', marginX + 13, y);
      doc
        .fillColor(COLOR.textoSuave)
        .font('Helvetica')
        .fontSize(8.5)
        .text(
          formatearNumero(data.cursos.length) + ' curso' + (data.cursos.length === 1 ? '' : 's') + ' en el listado',
          marginX + 13,
          y + 18,
        );
      y += 39;
      dibujarCabeceraTabla(y);
      y += tableHeaderHeight;

      if (data.cursos.length === 0) {
        const emptyHeight = 86;
        doc.roundedRect(tableX, y, contentWidth, emptyHeight, 8).fillAndStroke(COLOR.superficie, COLOR.borde);
        doc.circle(tableX + 38, y + emptyHeight / 2, 18).fill(COLOR.verdeClaro);
        doc
          .fillColor(COLOR.verde)
          .font('Helvetica-Bold')
          .fontSize(17)
          .text('—', tableX + 27, y + emptyHeight / 2 - 10, { width: 22, align: 'center' });
        doc
          .font('Helvetica-Bold')
          .fontSize(10.5)
          .fillColor(COLOR.textoSuave)
          .text('No hay cursos registrados para este reporte.', tableX + 70, y + 27, { width: contentWidth - 90 });
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor(COLOR.textoSuave)
          .text('Cuando existan registros, aparecerán organizados en este espacio.', tableX + 70, y + 45, {
            width: contentWidth - 90,
          });
        y += emptyHeight;
      }

      data.cursos.forEach((c, i) => {
        doc.font('Helvetica').fontSize(10);
        const altoTexto = Math.min(
          36,
          doc.heightOfString(c.nombre || 'Curso sin nombre', { width: nombreWidth, lineGap: 1 }),
        );
        const altoFila = Math.max(42, Math.ceil(altoTexto) + 20);
        if (y + altoFila > footerY - 12) {
          doc.addPage();
          dibujarEncabezadoContinuacion();
          y = 77;
          dibujarCabeceraTabla(y);
          y += tableHeaderHeight;
        }
        dibujarFila(y, c.posicion, c.nombre, c.puntos, altoFila, i % 2 === 1);
        y += altoFila;
      });

      const range = doc.bufferedPageRange();
      const margenInferiorOriginal = doc.page.margins.bottom;
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.page.margins.bottom = 0;
        doc.moveTo(marginX, footerY - 9).lineTo(pageWidth - marginX, footerY - 9).lineWidth(0.6).stroke(COLOR.borde);
        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor(COLOR.textoSuave)
          .text('APP COINS  ·  REPORTE DE RECICLAJE', marginX, footerY, {
            width: contentWidth / 2,
          });
        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor(COLOR.textoSuave)
          .text('Página ' + (i + 1) + ' de ' + range.count, marginX + contentWidth / 2, footerY, {
            width: contentWidth / 2,
            align: 'right',
          });
        doc.page.margins.bottom = margenInferiorOriginal;
      }

      doc.end();
    });
  }
}
