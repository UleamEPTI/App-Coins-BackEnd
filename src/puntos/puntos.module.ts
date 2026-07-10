import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialPuntos } from './entities/historial-puntos.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { PuntosService } from './puntos.service';
import { PuntosController } from './puntos.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
// COMENTADO: antes registraba Estudiante, ahora es Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';

@Module({
  imports: [
    // COMENTADO: TypeOrmModule.forFeature([HistorialPuntos, Estudiante]),
    TypeOrmModule.forFeature([HistorialPuntos, Curso]),
    AuditoriaModule,
  ],
  providers: [PuntosService],
  controllers: [PuntosController],
  exports: [PuntosService],
})
export class PuntosModule {}