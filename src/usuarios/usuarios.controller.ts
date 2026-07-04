import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Usuarios')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Roles('ADMIN', 'INSTITUCION')
  @Get()
  @ApiOperation({ summary: 'Listar usuarios con filtros y paginación' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre, apellido o email' })
  @ApiQuery({ name: 'rol', required: false, description: 'ADMIN, INSTITUCION, DOCENTE, ESTUDIANTE' })
  @ApiQuery({ name: 'institucion_id', required: false })
  @ApiQuery({ name: 'estado', required: false, enum: ['activo', 'inactivo'] })
  @ApiQuery({ name: 'page', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Resultados por página (default: 20)' })
  findAll(
    @Query('search') search?: string,
    @Query('rol') rol?: string,
    @Query('institucion_id') institucion_id?: string,
    @Query('estado') estado?: 'activo' | 'inactivo',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usuariosService.findAllFiltrado({
      search,
      rol,
      institucion_id,
      estado,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('roles')
  @ApiOperation({ summary: 'Obtener lista de roles' })
  getRoles() {
    return this.usuariosService.getRoles();
  }

  @Roles('ADMIN', 'INSTITUCION', 'DOCENTE')
  @Get(':id')
  @ApiOperation({ summary: 'Ver un usuario' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateUsuarioDto>) {
    return this.usuariosService.update(id, dto);
  }

  @Roles('ADMIN', 'INSTITUCION')
  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar usuario' })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}