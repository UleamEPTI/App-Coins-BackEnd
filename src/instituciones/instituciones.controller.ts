import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InstitucionesService } from './instituciones.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';

@ApiTags('Instituciones')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('instituciones')
export class InstitucionesController {
  constructor(private readonly institucionesService: InstitucionesService) {}

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Crear institución (ADMIN)' })
  create(@Body() dto: CreateInstitucionDto, @Request() req: any) {
    return this.institucionesService.create(dto, req.user.id, req.user.email, req.ip);
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get()
  @ApiOperation({ summary: 'Listar instituciones con filtros y paginación' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'activo', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['nombre', 'created_at', 'codigo'] })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  findAll(
    @Query('search') search?: string,
    @Query('activo') activo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'nombre' | 'created_at' | 'codigo',
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.institucionesService.findAll({
      search,
      activo: activo !== undefined ? activo === 'true' : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      sort,
      order,
    });
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get(':id')
  @ApiOperation({ summary: 'Ver institución por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.institucionesService.findOne(id);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar institución' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateInstitucionDto>, @Request() req: any) {
    return this.institucionesService.update(id, dto, req.user.id, req.user.email, req.ip);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar institución (ADMIN)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.institucionesService.remove(id, req.user.id, req.user.email, req.ip);
  }
}