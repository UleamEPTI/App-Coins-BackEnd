import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Institucion } from '../../instituciones/entities/institucion.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  paralelo: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Institucion)
  @JoinColumn({ name: 'institucion_id' })
  institucion_id: string;

  @Column({ default: true })
  activo: boolean;

  // NUEVO: el curso ahora acumula la moneda directamente (antes era
  // Estudiante quien tenía este campo).
  @Column({ default: 0 })
  puntos: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}