import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
// COMENTADO: ya no se usa tipo_botella, ahora se registra directo en kilos.
// import { TipoBotella } from '../../tipos-botella/entities/tipo-botella.entity';
// import { Estudiante } from '../../estudiantes/entities/estudiante.entity';

@Entity('reciclajes')
export class Reciclaje {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // COMENTADO: antes apuntaba a Estudiante, ahora apunta a Curso.
  // @ManyToOne(() => Estudiante)
  // @JoinColumn({ name: 'estudiante_id' })
  // estudiante: Estudiante;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  // COMENTADO: ya no hay tipos de botella, todo se registra en kilos.
  // @ManyToOne(() => TipoBotella)
  // @JoinColumn({ name: 'tipo_botella_id' })
  // tipo_botella: TipoBotella;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registrado_por' })
  registrado_por: Usuario;

  // COMENTADO: antes era 'cantidad' (de botellas), ahora es 'kilos'.
  // @Column({ default: 1 })
  // cantidad: number;

  @Column()
  kilos: number;

  @Column({ name: 'puntos_ganados' })
  puntos_ganados: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}