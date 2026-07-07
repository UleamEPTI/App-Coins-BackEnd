import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateTipoBotellaDto {
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