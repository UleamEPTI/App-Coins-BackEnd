import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Premio } from './entities/premio.entity';
import { PremiosService } from './premios.service';
import { PremiosController } from './premios.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Premio]),
    AuditoriaModule,
  ],
  providers: [PremiosService],
  controllers: [PremiosController],
  exports: [PremiosService],
})
export class PremiosModule {}