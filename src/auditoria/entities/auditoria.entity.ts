import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum AccionAuditoria {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tabla: string;

  @Column({ type: 'enum', enum: AccionAuditoria })
  accion: AccionAuditoria;

  @Column({ name: 'registro_id' })
  registro_id: string;

  @Column({ type: 'jsonb', nullable: true, name: 'datos_anteriores' })
  datos_anteriores: object;

  @Column({ type: 'jsonb', nullable: true, name: 'datos_nuevos' })
  datos_nuevos: object;

  @Column({ nullable: true, name: 'usuario_id' })
  usuario_id: string;

  @Column({ nullable: true, name: 'usuario_email' })
  usuario_email: string;

  @Column({ nullable: true })
  ip: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}