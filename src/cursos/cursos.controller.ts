import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Listar cursos con filtros y paginación' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'institucion_id', required: false })
  @ApiQuery({ name: 'activo', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['nombre', 'created_at', 'paralelo'] })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  findAll(
    @Query('search') search?: string,
    @Query('institucion_id') institucion_id?: string,
    @Query('activo') activo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'nombre' | 'created_at' | 'paralelo',
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.cursosService.findAll({
      search,
      institucion_id,
      activo: activo !== undefined ? activo === 'true' : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      sort,
      order,
    });
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