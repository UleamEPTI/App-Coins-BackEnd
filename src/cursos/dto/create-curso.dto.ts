import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateCursoDto {
  @ApiProperty({ example: 'Segundo BGU' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'B', required: false })
  @IsOptional()
  @IsString()
  paralelo?: string;

  @ApiProperty({ example: 'Segundo año bachillerato', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 'uuid-de-institucion' })
  @IsUUID()
  institucion_id: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}