import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateSolicitudDto {
  @ApiProperty({ example: 'uuid-del-usuario-a-cambiar-password' })
  @IsUUID()
  usuario_objetivo_id: string;

  @ApiProperty({ example: 'El docente olvidó su contraseña', required: false })
  @IsOptional()
  @IsString()
  mensaje?: string;
}