import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId, CreateDateColumn } from 'typeorm';
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

  // FIX: antes esta propiedad era a la vez la columna Y la relación
  // (@ManyToOne + @JoinColumn con el mismo nombre 'institucion_id'), lo
  // que hacía que su forma en el JSON cambiara según si el endpoint pedía
  // la relación o no (a veces string, a veces objeto, a veces ausente).
  //
  // Ahora `institucion` es la relación real, e `institucion_id` es un
  // campo calculado con @RelationId que SIEMPRE es un string plano con
  // el UUID, se haya cargado la relación o no. Probado con una entidad
  // aislada (crear + leer con y sin relación) antes de aplicar esto:
  // un intento anterior con @Column({ insert:false, update:false })
  // duplicando el mismo nombre de columna rompía el INSERT por completo
  // (TypeORM dejaba de escribir institucion_id en la tabla), por eso se
  // usa @RelationId en vez de esa alternativa.
  @ManyToOne(() => Institucion)
  @JoinColumn({ name: 'institucion_id' })
  institucion: Institucion;

  @RelationId((curso: Curso) => curso.institucion)
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