import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudPassword } from './entities/solicitud-password.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { SolicitudesPasswordService } from './solicitudes-password.service';
import { SolicitudesPasswordController } from './solicitudes-password.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SolicitudPassword, Usuario])],
  providers: [SolicitudesPasswordService],
  controllers: [SolicitudesPasswordController],
})
export class SolicitudesPasswordModule {}