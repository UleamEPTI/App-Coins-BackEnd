import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoBotella } from './entities/tipo-botella.entity';
import { TiposBotellaService } from './tipos-botella.service';
import { TiposBotellaController } from './tipos-botella.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoBotella])],
  providers: [TiposBotellaService],
  controllers: [TiposBotellaController],
  exports: [TiposBotellaService],
})
export class TiposBotellaModule {}