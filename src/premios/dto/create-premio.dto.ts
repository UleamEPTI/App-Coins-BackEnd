import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreatePremioDto {
  @ApiProperty({ example: 'Camiseta Bachillero' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Camiseta oficial de algodón', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 'https://imagen.com/foto.jpg', required: false })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ example: 150 })
  @IsInt()
  @Min(1)
  costo_puntos: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}