import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialPuntos } from '../puntos/entities/historial-puntos.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { PuntosService } from './puntos.service';
import { PuntosController } from './puntos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialPuntos, Estudiante])],
  providers: [PuntosService],
  controllers: [PuntosController],
  exports: [PuntosService],
})
export class PuntosModule {}
