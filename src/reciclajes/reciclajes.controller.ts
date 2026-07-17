import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReciclajesService } from './reciclajes.service';
import { CreateReciclajeDto } from './dto/create-reciclaje.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('reciclajes')
export class ReciclajesController {
  constructor(private readonly reciclajesService: ReciclajesService) {}

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Post()
  registrar(@Body() dto: CreateReciclajeDto, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.reciclajesService.registrar(dto, req.user.id, req.user.rol, req.user.institucion_id, ip);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.reciclajesService.findAll();
  }

  // COMENTADO: ya no existe estudiante individual, ahora se consulta por curso.
  // @Roles('ADMIN', 'INSTITUCION', 'DOCENTE', 'ESTUDIANTE')
  // @Get('estudiante/:estudiante_id')
  // findByEstudiante(@Param('estudiante_id', ParseUUIDPipe) estudiante_id: string) {
  //   return this.reciclajesService.findByEstudiante(estudiante_id);
  // }

  @Roles('ADMIN', 'INSTITUCION')
  @Get('institucion/:institucion_id')
  findByInstitucion(@Param('institucion_id', ParseUUIDPipe) institucion_id: string, @Request() req: any) {
    return this.reciclajesService.findByInstitucion(institucion_id, req.user.rol, req.user.institucion_id);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get('curso/:curso_id')
  findByCurso(@Param('curso_id', ParseUUIDPipe) curso_id: string, @Request() req: any) {
    return this.reciclajesService.findByCurso(curso_id, req.user.rol, req.user.institucion_id);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get('docente/:registrado_por_id')
  findByRegistradoPor(@Param('registrado_por_id', ParseUUIDPipe) registrado_por_id: string) {
    return this.reciclajesService.findByRegistradoPor(registrado_por_id);
  }
}