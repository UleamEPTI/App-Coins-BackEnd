import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';

@ApiTags('Cursos')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Roles('ADMIN', 'INSTITUCION')
  @Post()
  @ApiOperation({ summary: 'Crear curso' })
  create(@Body() dto: CreateCursoDto) {
    return this.cursosService.create(dto);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get()
  @ApiOperation({ summary: 'Listar todos los cursos' })
  findAll() {
    return this.cursosService.findAll();
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get('institucion/:institucion_id')
  @ApiOperation({ summary: 'Listar cursos de una institución' })
  findByInstitucion(@Param('institucion_id', ParseUUIDPipe) institucion_id: string) {
    return this.cursosService.findByInstitucion(institucion_id);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get(':id')
  @ApiOperation({ summary: 'Ver un curso' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cursosService.findOne(id);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar curso' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateCursoDto>) {
    return this.cursosService.update(id, dto);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar curso' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cursosService.remove(id);
  }
}