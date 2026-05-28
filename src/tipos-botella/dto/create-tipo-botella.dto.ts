import { IsString, IsInt, IsUUID, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateTipoBotellaDto {
  @IsUUID()
  institucion_id: string;

  @IsString()
  tamano: string;

  @IsInt()
  @Min(1)
  puntos: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}