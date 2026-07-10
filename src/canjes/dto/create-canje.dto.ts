import { IsUUID } from 'class-validator';

export class CreateCanjeDto {
  // COMENTADO: antes era estudiante_id, ahora es curso_id.
  // @IsUUID()
  // estudiante_id: string;

  @IsUUID()
  curso_id: string;

  @IsUUID()
  premio_id: string;
}