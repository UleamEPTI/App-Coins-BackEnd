import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria, AccionAuditoria } from './entities/auditoria.entity';

export interface AuditoriaPayload {
  tabla: string;
  accion: AccionAuditoria;
  registro_id: string;
  datos_anteriores?: object;
  datos_nuevos?: object;
  usuario_id?: string;
  usuario_email?: string;
  ip?: string;
}

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async registrar(payload: AuditoriaPayload): Promise<void> {
    const registro = this.auditoriaRepository.create(payload);
    await this.auditoriaRepository.save(registro);
  }

  async findAll() {
    return this.auditoriaRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findByTabla(tabla: string) {
    return this.auditoriaRepository.find({
      where: { tabla },
      order: { created_at: 'DESC' },
    });
  }

  async findByUsuario(usuario_id: string) {
    return this.auditoriaRepository.find({
      where: { usuario_id },
      order: { created_at: 'DESC' },
    });
  }

  async findByRegistro(tabla: string, registro_id: string) {
    return this.auditoriaRepository.find({
      where: { tabla, registro_id },
      order: { created_at: 'DESC' },
    });
  }
}