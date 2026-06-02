import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateInstitucionDto {
  @ApiProperty({ example: 'Unidad Educativa San José' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'UESJ-001' })
  @IsString()
  codigo: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}