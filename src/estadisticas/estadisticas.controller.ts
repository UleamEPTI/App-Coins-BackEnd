import { Controller, Get, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
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
  statsInstitucion(@Param('institucion_id', ParseUUIDPipe) institucion_id: string, @Request() req: any) {
    return this.estadisticasService.statsInstitucion(institucion_id, req.user.rol, req.user.institucion_id);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get('curso/:curso_id')
  statsCurso(@Param('curso_id', ParseUUIDPipe) curso_id: string, @Request() req: any) {
    return this.estadisticasService.statsCurso(curso_id, req.user.rol, req.user.institucion_id);
  }

  // Ranking de cursos: ahora por institución, visible para los 3 roles
  // (antes era por estudiante y se había planteado quitarlo).
  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get('ranking/institucion/:institucion_id')
  rankingInstitucion(@Param('institucion_id', ParseUUIDPipe) institucion_id: string, @Request() req: any) {
    return this.estadisticasService.rankingInstitucion(institucion_id, req.user.rol, req.user.institucion_id);
  }
}