import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateReciclajeDto {
  @IsUUID()
  estudiante_id: string;

  @IsUUID()
  tipo_botella_id: string;

  @IsInt()
  @Min(1)
  cantidad: number;
}