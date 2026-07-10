import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateReciclajeDto {
  // COMENTADO: antes era estudiante_id + tipo_botella_id, ahora es curso_id + kilos.
  // @ApiProperty({ example: 'uuid-del-estudiante' })
  // @IsUUID()
  // estudiante_id: string;
  //
  // @ApiProperty({ example: 'uuid-del-tipo-botella' })
  // @IsUUID()
  // tipo_botella_id: string;
  //
  // @ApiProperty({ example: 5 })
  // @IsInt()
  // @Min(1)
  // cantidad: number;

  @ApiProperty({ example: 'uuid-del-curso' })
  @IsUUID()
  curso_id: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  kilos: number;
}