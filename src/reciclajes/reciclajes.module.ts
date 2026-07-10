import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reciclaje } from './entities/reciclaje.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { HistorialPuntos } from '../puntos/entities/historial-puntos.entity';
import { ReciclajesService } from './reciclajes.service';
import { ReciclajesController } from './reciclajes.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
// COMENTADO: ya no se inyectan Estudiante ni TipoBotella, ahora es Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';
// import { TipoBotella } from '../tipos-botella/entities/tipo-botella.entity';

@Module({
  imports: [
    // COMENTADO: antes registraba Estudiante y TipoBotella.
    // TypeOrmModule.forFeature([Reciclaje, Estudiante, TipoBotella, Usuario, HistorialPuntos]),
    TypeOrmModule.forFeature([Reciclaje, Curso, Usuario, HistorialPuntos]),
    AuditoriaModule,
  ],
  providers: [ReciclajesService],
  controllers: [ReciclajesController],
  exports: [ReciclajesService],
})
export class ReciclajesModule {}