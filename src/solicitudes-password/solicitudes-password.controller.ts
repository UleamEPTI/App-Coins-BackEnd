import { Controller, Get, Post, Put, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SolicitudesPasswordService } from './solicitudes-password.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { AtenderSolicitudDto } from './dto/atender-solicitud.dto';
import { CambiarPasswordDirectoDto } from './dto/cambiar-password-directo.dto';

@ApiTags('SolicitudesPassword')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('solicitudes-password')
export class SolicitudesPasswordController {
  constructor(private readonly service: SolicitudesPasswordService) {}

  @Roles('ADMIN', 'INSTITUCION')
  @Post('cambio-directo/:usuario_id')
  @ApiOperation({ summary: 'INSTITUCION/ADMIN cambia contraseña directamente' })
  cambiarDirecto(
    @Param('usuario_id', ParseUUIDPipe) usuario_id: string,
    // FIX: antes era @Body('nueva_password') sin ningún DTO, así que no
    // pasaba por ValidationPipe y podía llegar vacía o cualquier cosa.
    @Body() dto: CambiarPasswordDirectoDto,
    @Request() req: any,
  ) {
    // NUEVO: se pasa el rol e institución de quien hace el cambio, para
    // que el service valide que INSTITUCION solo pueda tocar usuarios de
    // su propia institución (antes cualquier INSTITUCION podía cambiar
    // la contraseña de cualquier usuario del sistema con solo saber su
    // UUID, sin importar a qué institución perteneciera).
    return this.service.cambiarPasswordDirecto(usuario_id, dto.nueva_password, req.user.id, req.user.rol, req.user.institucion_id);
  }

  @Roles('INSTITUCION')
  @Post('solicitar')
  @ApiOperation({ summary: 'INSTITUCION solicita al ADMIN cambiar contraseña' })
  solicitar(@Body() dto: CreateSolicitudDto, @Request() req: any) {
    return this.service.crearSolicitud(dto, req.user.id);
  }

  @Roles('ADMIN')
  @Get('pendientes')
  @ApiOperation({ summary: 'ADMIN ve solicitudes pendientes' })
  pendientes() {
    return this.service.findPendientes();
  }

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'ADMIN ve todas las solicitudes' })
  findAll() {
    return this.service.findAll();
  }

  @Roles('ADMIN')
  @Put(':id/atender')
  @ApiOperation({ summary: 'ADMIN atiende una solicitud' })
  atender(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtenderSolicitudDto,
  ) {
    return this.service.atenderSolicitud(id, dto);
  }
}