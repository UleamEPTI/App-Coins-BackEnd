import { IsEmail, IsString, IsUUID, IsOptional, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsUUID()
  rol_id: string;

  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}