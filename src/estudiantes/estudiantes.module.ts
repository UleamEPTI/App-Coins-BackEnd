import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { CursosModule } from '../cursos/cursos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante]), CursosModule],
  providers: [EstudiantesService],
  controllers: [EstudiantesController],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}