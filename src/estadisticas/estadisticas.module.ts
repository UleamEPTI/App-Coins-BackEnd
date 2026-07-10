import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from '../cursos/entities/curso.entity';
import { Reciclaje } from '../reciclajes/entities/reciclaje.entity';
import { Canje } from '../canjes/entities/canje.entity';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
// COMENTADO: antes registraba Estudiante, ahora es Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';

@Module({
  // COMENTADO: imports: [TypeOrmModule.forFeature([Estudiante, Reciclaje, Canje])],
  imports: [TypeOrmModule.forFeature([Curso, Reciclaje, Canje])],
  providers: [EstadisticasService],
  controllers: [EstadisticasController],
})
export class EstadisticasModule {}