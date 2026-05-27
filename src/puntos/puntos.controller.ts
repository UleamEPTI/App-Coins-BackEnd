import { Controller, Post, Get, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PuntosService } from './puntos.service';
import { ModificarPuntosDto } from './dto/modificar-puntos.dto';

@UseGuards(JwtAuthGuard)
@Controller('puntos')
export class PuntosController {
  constructor(private readonly puntosService: PuntosService) {}

  @Post()
  modificar(@Body() dto: ModificarPuntosDto) {
    return this.puntosService.modificarPuntos(dto);
  }

  @Get('historial/:estudiante_id')
  historial(@Param('estudiante_id', ParseUUIDPipe) estudiante_id: string) {
    return this.puntosService.getHistorial(estudiante_id);
  }
}