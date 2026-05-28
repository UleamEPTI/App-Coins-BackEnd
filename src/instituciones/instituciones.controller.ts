import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InstitucionesService } from './instituciones.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('instituciones')
export class InstitucionesController {
  constructor(private readonly institucionesService: InstitucionesService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateInstitucionDto, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.institucionesService.create(dto, req.user.id, req.user.email, ip);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.institucionesService.findAll();
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.institucionesService.findOne(id);
  }

  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateInstitucionDto>, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.institucionesService.update(id, dto, req.user.id, req.user.email, ip);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const ip = req.ip ?? req.headers['x-forwarded-for'];
    return this.institucionesService.remove(id, req.user.id, req.user.email, ip);
  }
}