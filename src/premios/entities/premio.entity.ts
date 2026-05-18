import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('premios')
export class Premio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ name: 'imagen_url', nullable: true }) // Mapeado correctamente a la columna física de la BD
  imagen: string;

  @Column({ name: 'puntos_requeridos' }) // Traduce 'costo_puntos' en el código a 'puntos_requeridos' en Postgres
  costo_puntos: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}