import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { EstadoSolicitud } from '../entities/solicitud-password.entity';

export class AtenderSolicitudDto {
  @ApiProperty({ example: 'nuevaPassword123' })
  @IsString()
  @MinLength(6)
  nueva_password: string;

  @ApiProperty({ enum: EstadoSolicitud, example: EstadoSolicitud.ATENDIDA })
  @IsEnum(EstadoSolicitud)
  estado: EstadoSolicitud;

  @ApiProperty({ example: 'Contraseña cambiada exitosamente', required: false })
  @IsOptional()
  @IsString()
  mensaje?: string;
}