import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
import { TipoBotella } from '../../tipos-botella/entities/tipo-botella.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('reciclajes')
export class Reciclaje {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => TipoBotella)
  @JoinColumn({ name: 'tipo_botella_id' })
  tipo_botella: TipoBotella;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registrado_por' })
  registrado_por: Usuario;

  @Column({ default: 1 })
  cantidad: number;

  @Column({ name: 'puntos_ganados' })
  puntos_ganados: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}