import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudiantesService } from './estudiantes.service';
// COMENTADO: el controller quedó completamente comentado (Bachillero pidió
// quitar la gestión de estudiante individual). Ya no se registra aquí.
// import { EstudiantesController } from './estudiantes.controller';
import { Estudiante } from './entities/estudiante.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Curso, Usuario])],
  providers: [EstudiantesService],
  // COMENTADO: controllers: [EstudiantesController],
  controllers: [],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}