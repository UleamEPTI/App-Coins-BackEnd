import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canje } from './entities/canje.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Premio } from '../premios/entities/premio.entity';
import { HistorialPuntos } from '../puntos/entities/historial-puntos.entity';
import { CanjesService } from './canjes.service';
import { CanjesController } from './canjes.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
// COMENTADO: antes registraba Estudiante, ahora es Curso.
// import { Estudiante } from '../estudiantes/entities/estudiante.entity';

@Module({
  imports: [
    // COMENTADO: TypeOrmModule.forFeature([Canje, Estudiante, Premio, HistorialPuntos]),
    TypeOrmModule.forFeature([Canje, Curso, Premio, HistorialPuntos]),
    AuditoriaModule,
  ],
  providers: [CanjesService],
  controllers: [CanjesController],
})
export class CanjesModule {}