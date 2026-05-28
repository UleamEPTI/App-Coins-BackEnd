import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institucion } from './entities/institucion.entity';
import { InstitucionesService } from './instituciones.service';
import { InstitucionesController } from './instituciones.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Institucion]),
    AuditoriaModule,
  ],
  providers: [InstitucionesService],
  controllers: [InstitucionesController],
  exports: [InstitucionesService],
})
export class InstitucionesModule {}