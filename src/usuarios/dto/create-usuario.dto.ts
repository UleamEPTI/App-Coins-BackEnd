import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateUsuarioDto {
  @IsUUID()
  rol_id: string;

  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsUUID()
  institucion_id?: string;

  @IsOptional()
  @IsUUID()
  curso_id?: string;
}