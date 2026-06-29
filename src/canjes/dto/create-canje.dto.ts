import { IsUUID } from 'class-validator';

export class CreateCanjeDto {
  @IsUUID()
  estudiante_id: string;
  
  @IsUUID()
  premio_id: string;
}