import { Controller, Post, Get, Put, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CanjesService } from './canjes.service';
import { CreateCanjeDto } from './dto/create-canje.dto';
import { EstadoCanje } from './entities/canje.entity';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('canjes')
export class CanjesController {
  constructor(private readonly canjesService: CanjesService) {}

  @Roles('ADMIN', 'INSTITUCION', 'ESTUDIANTE')
  @Post()
  canjear(@Body() dto: CreateCanjeDto, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.canjesService.canjear(dto, req.user.id, req.user.email, ip);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Get()
  findAll() {
    return this.canjesService.findAll();
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE', 'ESTUDIANTE')
  @Get('estudiante/:estudiante_id')
  findByEstudiante(@Param('estudiante_id', ParseUUIDPipe) estudiante_id: string) {
    return this.canjesService.findByEstudiante(estudiante_id);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Put(':id/estado')
  actualizarEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('estado') estado: EstadoCanje,
    @Request() req: any,
  ) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.canjesService.actualizarEstado(id, estado, req.user.id, req.user.email, ip);
  }
}