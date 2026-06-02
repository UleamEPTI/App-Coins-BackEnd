import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateReciclajeDto {
  @ApiProperty({ example: 'uuid-del-estudiante' })
  @IsUUID()
  estudiante_id: string;

  @ApiProperty({ example: 'uuid-del-tipo-botella' })
  @IsUUID()
  tipo_botella_id: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  cantidad: number;
}