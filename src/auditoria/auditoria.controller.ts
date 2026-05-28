import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuditoriaService } from './auditoria.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.auditoriaService.findAll();
  }

  @Roles('ADMIN')
  @Get('tabla/:tabla')
  findByTabla(@Param('tabla') tabla: string) {
    return this.auditoriaService.findByTabla(tabla);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Get('usuario/:usuario_id')
  findByUsuario(@Param('usuario_id', ParseUUIDPipe) usuario_id: string) {
    return this.auditoriaService.findByUsuario(usuario_id);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Get(':tabla/:registro_id')
  findByRegistro(
    @Param('tabla') tabla: string,
    @Param('registro_id', ParseUUIDPipe) registro_id: string,
  ) {
    return this.auditoriaService.findByRegistro(tabla, registro_id);
  }
}