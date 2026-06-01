import { Controller, Get, Param, ParseUUIDPipe, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReportesService } from './reportes.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Roles('ADMIN', 'INSTITUCION')
  @Get('institucion/:institucion_id')
  async reporteInstitucion(
    @Param('institucion_id', ParseUUIDPipe) institucion_id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesService.generarReporteInstitucion(institucion_id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-institucion-${institucion_id}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get('curso/:curso_id')
  async reporteCurso(
    @Param('curso_id', ParseUUIDPipe) curso_id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesService.generarReporteCurso(curso_id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-curso-${curso_id}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}