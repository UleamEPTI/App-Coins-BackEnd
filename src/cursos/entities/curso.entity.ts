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

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Institucion)
  @JoinColumn({ name: 'institucion_id' })
  institucion: Institucion;

  @Column({ name: 'institucion_id' })
  institucion_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}