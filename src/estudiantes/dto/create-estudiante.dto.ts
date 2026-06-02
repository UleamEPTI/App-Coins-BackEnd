import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateEstudianteDto {
  @ApiProperty({ example: 'uuid-del-usuario' })
  @IsUUID()
  usuario_id: string;

  @ApiProperty({ example: 'uuid-del-curso' })
  @IsUUID()
  curso_id: string;

  @ApiProperty({ example: 'EST-001', required: false })
  @IsOptional()
  @IsString()
  codigo_estudiante?: string;

  @ApiProperty({ example: '2005-03-15', required: false })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({ example: 'Av. Principal 123', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;
}