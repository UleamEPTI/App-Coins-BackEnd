import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { PremiosService } from './premios.service';
import { CreatePremioDto } from './dto/create-premio.dto';

@Controller('premios')
export class PremiosController {
  constructor(private readonly premiosService: PremiosService) {}

  @Post()
  create(@Body() dto: CreatePremioDto) {
    return this.premiosService.create(dto);
  }

  @Get()
  findAll() {
    return this.premiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.premiosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreatePremioDto>) {
    return this.premiosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.premiosService.remove(id);
  }
}