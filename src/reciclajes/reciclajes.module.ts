import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reciclaje } from './entities/reciclaje.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { TipoBotella } from '../tipos-botella/entities/tipo-botella.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { HistorialPuntos } from '../puntos/entities/historial-puntos.entity';
import { ReciclajesService } from './reciclajes.service';
import { ReciclajesController } from './reciclajes.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reciclaje, Estudiante, TipoBotella, Usuario, HistorialPuntos]),
    AuditoriaModule,
  ],
  providers: [ReciclajesService],
  controllers: [ReciclajesController],
  exports: [ReciclajesService],
})
export class ReciclajesModule {}