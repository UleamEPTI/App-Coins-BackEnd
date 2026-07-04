import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@ApiTags('Estudiantes')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Roles('ADMIN', 'INSTITUCION')
  @Post()
  @ApiOperation({ summary: 'Crear estudiante' })
  create(@Body() dto: CreateEstudianteDto) {
    return this.estudiantesService.create(dto);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get()
  @ApiOperation({ summary: 'Listar estudiantes con filtros y paginación' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre, apellido o código' })
  @ApiQuery({ name: 'curso_id', required: false })
  @ApiQuery({ name: 'institucion_id', required: false })
  @ApiQuery({ name: 'activo', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['apellidos', 'puntos', 'created_at', 'codigo_estudiante'] })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  findAll(
    @Query('search') search?: string,
    @Query('curso_id') curso_id?: string,
    @Query('institucion_id') institucion_id?: string,
    @Query('activo') activo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'apellidos' | 'puntos' | 'created_at' | 'codigo_estudiante',
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.estudiantesService.findAll({
      search,
      curso_id,
      institucion_id,
      activo: activo !== undefined ? activo === 'true' : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      sort,
      order,
    });
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get(':id')
  @ApiOperation({ summary: 'Ver un estudiante' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estudiantesService.findOne(id);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar estudiante' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateEstudianteDto>) {
    return this.estudiantesService.update(id, dto);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar estudiante' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.estudiantesService.remove(id);
  }
}