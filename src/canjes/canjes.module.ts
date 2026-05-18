import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canje } from './entities/canje.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Premio } from '../premios/entities/premio.entity';
import { HistorialPuntos } from '../historial/entities/historial-puntos.entity';
import { CanjesService } from './canjes.service';
import { CanjesController } from './canjes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Canje, Estudiante, Premio, HistorialPuntos])],
  providers: [CanjesService],
  controllers: [CanjesController],
})
export class CanjesModule {}