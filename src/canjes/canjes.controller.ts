import { Controller, Post, Get, Put, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CanjesService } from './canjes.service';
import { CreateCanjeDto } from './dto/create-canje.dto';
import { EstadoCanje } from './entities/canje.entity';

@UseGuards(JwtAuthGuard)
@Controller('canjes')
export class CanjesController {
  constructor(private readonly canjesService: CanjesService) {}

  @Post()
  canjear(@Body() dto: CreateCanjeDto) {
    return this.canjesService.canjear(dto);
  }

  @Get()
  findAll() {
    return this.canjesService.findAll();
  }

  @Get('estudiante/:estudiante_id')
  findByEstudiante(@Param('estudiante_id', ParseUUIDPipe) estudiante_id: string) {
    return this.canjesService.findByEstudiante(estudiante_id);
  }

  @Put(':id/estado')
  actualizarEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('estado') estado: EstadoCanje,
  ) {
    return this.canjesService.actualizarEstado(id, estado);
  }
}