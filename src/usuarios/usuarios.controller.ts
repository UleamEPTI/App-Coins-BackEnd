import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Solo ADMIN puede ver todos los usuarios
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  // Todos los roles pueden ver los roles disponibles
  @Get('roles')
  getRoles() {
    return this.usuariosService.getRoles();
  }

  // ADMIN y DOCENTE pueden ver un usuario
  @Roles('ADMIN', 'DOCENTE')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  // Solo ADMIN puede crear usuarios
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  // Solo ADMIN puede editar usuarios
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateUsuarioDto>) {
    return this.usuariosService.update(id, dto);
  }

  // Solo ADMIN puede eliminar usuarios
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}