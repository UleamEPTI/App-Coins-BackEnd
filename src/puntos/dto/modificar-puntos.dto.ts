import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { TipoTransaccion } from '../entities/historial-puntos.entity';

export class ModificarPuntosDto {
  // COMENTADO: antes era estudiante_id, ahora es curso_id.
  // @ApiProperty({ example: 'uuid-del-estudiante' })
  // @IsUUID()
  // estudiante_id: string;

  @ApiProperty({ example: 'uuid-del-curso' })
  @IsUUID()
  curso_id: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(1)
  puntos: number;

  @ApiProperty({ enum: TipoTransaccion, example: TipoTransaccion.SUMA })
  @IsEnum(TipoTransaccion)
  tipo: TipoTransaccion;

  @ApiProperty({ example: 'Participación en evento', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;
}