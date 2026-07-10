import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
// COMENTADO: antes apuntaba a Estudiante, ahora apunta a Curso.
// import { Estudiante } from '../../estudiantes/entities/estudiante.entity';

export enum TipoTransaccion {
  SUMA = 'SUMA',
  RESTA = 'RESTA',
  CANJE = 'CANJE',
}

@Entity('historial_puntos')
export class HistorialPuntos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // COMENTADO: antes apuntaba a Estudiante.
  // @ManyToOne(() => Estudiante)
  // @JoinColumn({ name: 'estudiante_id' })
  // estudiante: Estudiante;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @Column({ type: 'enum', enum: TipoTransaccion })
  tipo: TipoTransaccion;

  @Column()
  puntos: number;

  @Column({ nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}