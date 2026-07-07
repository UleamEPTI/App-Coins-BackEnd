import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TiposBotellaService } from './tipos-botella.service';
import { CreateTipoBotellaDto } from './dto/create-tipo-botella.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tipos-botella')
export class TiposBotellaController {
  constructor(private readonly tiposBotellaService: TiposBotellaService) {}

  @Roles('ADMIN', 'INSTITUCION')
  @Post()
  create(@Body() dto: CreateTipoBotellaDto) {
    return this.tiposBotellaService.create(dto);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get()
  findAll() {
    return this.tiposBotellaService.findAll();
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tiposBotellaService.findOne(id);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateTipoBotellaDto>) {
    return this.tiposBotellaService.update(id, dto);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tiposBotellaService.remove(id);
  }
}