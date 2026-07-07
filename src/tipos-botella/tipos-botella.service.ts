import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoBotella } from './entities/tipo-botella.entity';
import { CreateTipoBotellaDto } from './dto/create-tipo-botella.dto';

@Injectable()
export class TiposBotellaService {
  constructor(
    @InjectRepository(TipoBotella)
    private readonly tipoBotellaRepository: Repository<TipoBotella>,
  ) {}

  async create(dto: CreateTipoBotellaDto): Promise<TipoBotella> {
    const tipo = this.tipoBotellaRepository.create(dto);
    return this.tipoBotellaRepository.save(tipo);
  }

  async findAll(): Promise<TipoBotella[]> {
    return this.tipoBotellaRepository.find({ where: { activo: true } });
  }

  async findOne(id: string): Promise<TipoBotella> {
    const tipo = await this.tipoBotellaRepository.findOne({ where: { id } });
    if (!tipo) throw new NotFoundException(`Tipo de botella ${id} no encontrado`);
    return tipo;
  }

  async update(id: string, dto: Partial<CreateTipoBotellaDto>): Promise<TipoBotella> {
    const tipo = await this.findOne(id);
    Object.assign(tipo, dto);
    return this.tipoBotellaRepository.save(tipo);
  }

  async remove(id: string): Promise<{ message: string }> {
    const tipo = await this.findOne(id);
    tipo.activo = false;
    await this.tipoBotellaRepository.save(tipo);
    return { message: `Tipo de botella ${id} desactivado` };
  }
}