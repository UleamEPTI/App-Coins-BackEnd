import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialPuntos } from './entities/historial-puntos.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { PuntosService } from './puntos.service';
import { PuntosController } from './puntos.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistorialPuntos, Estudiante]),
    AuditoriaModule,
  ],
  providers: [PuntosService],
  controllers: [PuntosController],
  exports: [PuntosService],
})
export class PuntosModule {}