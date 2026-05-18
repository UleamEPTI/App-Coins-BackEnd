import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Rol } from './rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true, nullable: true })
  cedula: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ name: 'password_hash' })
  password_hash: string;

  @Column({ nullable: true })
  foto_perfil: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
  
}