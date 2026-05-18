import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Premio } from './entities/premio.entity';
import { CreatePremioDto } from './dto/create-premio.dto';

@Injectable()
export class PremiosService {
  constructor(
    @InjectRepository(Premio)
    private readonly premioRepository: Repository<Premio>,
  ) {}

  async create(dto: CreatePremioDto): Promise<Premio> {
    const premio = this.premioRepository.create(dto);
    return this.premioRepository.save(premio);
  }

  async findAll(): Promise<Premio[]> {
    return this.premioRepository.find({ where: { activo: true } });
  }

  async findOne(id: string): Promise<Premio> {
    const premio = await this.premioRepository.findOne({ where: { id } });
    if (!premio) throw new NotFoundException(`Premio ${id} no encontrado`);
    return premio;
  }

  async update(id: string, dto: Partial<CreatePremioDto>): Promise<Premio> {
    const premio = await this.findOne(id);
    Object.assign(premio, dto);
    return this.premioRepository.save(premio);
  }

  async remove(id: string): Promise<{ message: string }> {
    const premio = await this.findOne(id);
    premio.activo = false;
    await this.premioRepository.save(premio);
    return { message: `Premio ${id} desactivado correctamente` };
  }
}