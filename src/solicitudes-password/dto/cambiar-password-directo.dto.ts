import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

// NUEVO: antes el endpoint cambio-directo tomaba el body crudo con
// @Body('nueva_password') sin ningún DTO, así que no pasaba por
// ValidationPipe y no tenía ninguna validación (podía ser hasta una
// cadena vacía). Se crea este DTO con la misma regla de longitud mínima
// que ya usa AtenderSolicitudDto, para que quede consistente.
export class CambiarPasswordDirectoDto {
  @ApiProperty({ example: 'nuevaPassword123' })
  @IsString()
  @MinLength(6)
  nueva_password: string;
}