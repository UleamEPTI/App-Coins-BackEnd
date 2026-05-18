// src/premios/dto/create-premio.dto.ts
import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreatePremioDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsInt()
  @Min(1)
  costo_puntos: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}