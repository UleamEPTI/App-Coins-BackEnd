import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum EstadoSolicitud {
  PENDIENTE = 'PENDIENTE',
  ATENDIDA = 'ATENDIDA',
  RECHAZADA = 'RECHAZADA',
}

@Entity('solicitudes_password')
export class SolicitudPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'solicitado_por' })
  solicitado_por: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_objetivo' })
  usuario_objetivo: Usuario;

  @Column({ default: EstadoSolicitud.PENDIENTE })
  estado: string;

  @Column({ nullable: true })
  mensaje: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}