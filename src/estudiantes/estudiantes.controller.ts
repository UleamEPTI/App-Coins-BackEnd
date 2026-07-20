import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Roles('ADMIN', 'DOCENTE')
  @Get()
  findAll() {
    return this.estudiantesService.findAll();
  }

  @Roles('ADMIN', 'DOCENTE')
  @Get('cursos')
  getCursos() {
    return this.estudiantesService.getCursos();
  }

  @Roles('ADMIN', 'DOCENTE')
  @Get('curso/:cursoId')
  findByCurso(@Param('cursoId') cursoId: string) {
    return this.estudiantesService.findByCurso(cursoId);
  }

  @Roles('ADMIN', 'DOCENTE')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(id);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateEstudianteDto) {
    return this.estudiantesService.create(dto);
  }

  @Roles('ADMIN')
  @Post('cursos')
  createCurso(@Body() body: { nombre: string; paralelo: string; descripcion?: string }) {
    return this.estudiantesService.createCurso(body.nombre, body.paralelo, body.descripcion);
  }

  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateEstudianteDto>) {
    return this.estudiantesService.update(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(id);
  }
}