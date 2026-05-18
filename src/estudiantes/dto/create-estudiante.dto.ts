import { IsUUID, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateEstudianteDto {
  @IsUUID()
  usuario_id: string;

  @IsUUID()
  curso_id: string;

  @IsOptional()
  @IsString()
  codigo_estudiante?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}