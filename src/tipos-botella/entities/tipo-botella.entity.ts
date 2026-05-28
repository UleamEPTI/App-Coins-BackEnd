import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tipos_botella')
export class TipoBotella {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'institucion_id' })
  institucion_id: string;

  @Column()
  tamano: string;

  @Column()
  puntos: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}