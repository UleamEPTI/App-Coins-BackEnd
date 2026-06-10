import { Controller, Get, Post, Put, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SolicitudesPasswordService } from './solicitudes-password.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { AtenderSolicitudDto } from './dto/atender-solicitud.dto';

@ApiTags('SolicitudesPassword')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('solicitudes-password')
export class SolicitudesPasswordController {
  constructor(private readonly service: SolicitudesPasswordService) {}

  @Roles('ADMIN', 'INSTITUCION')
  @Post('cambio-directo/:usuario_id')
  @ApiOperation({ summary: 'INSTITUCION/ADMIN cambia contraseña directamente' })
  cambiarDirecto(
    @Param('usuario_id', ParseUUIDPipe) usuario_id: string,
    @Body('nueva_password') nueva_password: string,
    @Request() req: any,
  ) {
    return this.service.cambiarPasswordDirecto(usuario_id, nueva_password, req.user.id);
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