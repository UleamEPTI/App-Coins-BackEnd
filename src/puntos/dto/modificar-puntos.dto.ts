import { IsUUID, IsInt, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { TipoTransaccion } from '../../historial/entities/historial-puntos.entity';

export class ModificarPuntosDto {
  @IsUUID()
  estudiante_id: string;

  @IsInt()
  @Min(1)
  puntos: number;

  @IsEnum(TipoTransaccion)
  tipo: TipoTransaccion;

  @IsOptional()
  @IsString()
  descripcion?: string;
}