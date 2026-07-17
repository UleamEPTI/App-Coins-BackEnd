import { Controller, Post, Get, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PuntosService } from './puntos.service';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('puntos')
export class PuntosController {
  constructor(private readonly puntosService: PuntosService) {}

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Post()
  modificar(@Body() dto: ModificarPuntosDto, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.puntosService.modificarPuntos(dto, req.user.id, req.user.email, req.user.rol, req.user.institucion_id, ip);
  }

  // COMENTADO: antes la ruta y el rol ESTUDIANTE aplicaban a un estudiante
  // individual. Ahora el parámetro es curso_id y ya no hay rol ESTUDIANTE
  // consultando su propio historial.
  // @Roles('ADMIN', 'INSTITUCION', 'DOCENTE', 'ESTUDIANTE')
  // @Get('historial/:estudiante_id')
  // historial(@Param('estudiante_id', ParseUUIDPipe) estudiante_id: string) {
  //   return this.puntosService.getHistorial(estudiante_id);
  // }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get('historial/:curso_id')
  historial(@Param('curso_id', ParseUUIDPipe) curso_id: string, @Request() req: any) {
    return this.puntosService.getHistorial(curso_id, req.user.rol, req.user.institucion_id);
  }
}