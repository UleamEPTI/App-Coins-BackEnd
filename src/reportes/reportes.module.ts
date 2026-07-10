import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
// COMENTADO: antes registraba Estudiante y Canje, ahora es Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';
// import { Canje } from '../canjes/entities/canje.entity';

@Module({
  // COMENTADO: imports: [TypeOrmModule.forFeature([Estudiante, Reciclaje, Canje])],
  imports: [TypeOrmModule.forFeature([Curso, Reciclaje])],
  providers: [ReportesService],
  controllers: [ReportesController],
})
export class ReportesModule {}