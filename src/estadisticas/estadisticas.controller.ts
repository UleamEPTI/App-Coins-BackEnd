import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EstadisticasService } from './estadisticas.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Roles('ADMIN', 'INSTITUCION')
  @Get('institucion/:institucion_id')
  statsInstitucion(@Param('institucion_id', ParseUUIDPipe) institucion_id: string) {
    return this.estadisticasService.statsInstitucion(institucion_id);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get('curso/:curso_id')
  statsCurso(@Param('curso_id', ParseUUIDPipe) curso_id: string) {
    return this.estadisticasService.statsCurso(curso_id);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Get('ranking/institucion/:institucion_id')
  rankingInstitucion(@Param('institucion_id', ParseUUIDPipe) institucion_id: string) {
    return this.estadisticasService.rankingInstitucion(institucion_id);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE', 'ESTUDIANTE')
  @Get('ranking/curso/:curso_id')
  rankingCurso(@Param('curso_id', ParseUUIDPipe) curso_id: string) {
    return this.estadisticasService.rankingCurso(curso_id);
  }
}