    import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Canje } from '../canjes/entities/canje.entity';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Reciclaje, Canje])],
  providers: [EstadisticasService],
  controllers: [EstadisticasController],
})
export class EstadisticasModule {}