import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateInstitucionDto {
  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}