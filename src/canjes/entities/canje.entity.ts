import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
import { Premio } from '../../premios/entities/premio.entity';

export enum EstadoCanje {
  PENDIENTE = 'PENDIENTE',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

@Entity('canjes')
export class Canje {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Premio)
  @JoinColumn({ name: 'premio_id' })
  premio: Premio;

  @Column({ name: 'puntos_gastados' })
  puntos_gastados: number;

  @Column({ type: 'enum', enum: EstadoCanje, default: EstadoCanje.PENDIENTE })
  estado: EstadoCanje;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}