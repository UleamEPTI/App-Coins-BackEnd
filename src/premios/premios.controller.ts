import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PremiosService } from './premios.service';
import { CreatePremioDto } from './dto/create-premio.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('premios')
export class PremiosController {
  constructor(private readonly premiosService: PremiosService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreatePremioDto, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.premiosService.create(dto, req.user.id, req.user.email, ip);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE', 'ESTUDIANTE')
  @Get()
  findAll() {
    return this.premiosService.findAll();
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE', 'ESTUDIANTE')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.premiosService.findOne(id);
  }

  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreatePremioDto>, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.premiosService.update(id, dto, req.user.id, req.user.email, ip);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.premiosService.remove(id, req.user.id, req.user.email, ip);
  }
}