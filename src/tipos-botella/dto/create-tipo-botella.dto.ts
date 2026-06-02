import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUUID, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateTipoBotellaDto {
  @ApiProperty({ example: 'uuid-de-la-institucion' })
  @IsUUID()
  institucion_id: string;

  @ApiProperty({ example: '500ml' })
  @IsString()
  tamano: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  puntos: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}