import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'uuid-del-rol' })
  @IsUUID()
  rol_id: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  apellidos: string;

  @ApiProperty({ example: '0912345678', required: false })
  @IsOptional()
  @IsString()
  cedula?: string;

  @ApiProperty({ example: '0999999999', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'juan@correo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'uuid-de-institucion', required: false })
  @IsOptional()
  @IsUUID()
  institucion_id?: string;

  @ApiProperty({ example: 'uuid-de-curso', required: false })
  @IsOptional()
  @IsUUID()
  curso_id?: string;
}