import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BackupService } from './backup.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Backup')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Roles('ADMIN')
  @Post('manual')
  @ApiOperation({ summary: 'Generar backup manual (solo ADMIN)' })
  generarManual() {
    return this.backupService.generarBackup('manual');
  }

  @Roles('ADMIN')
  @Get('listar')
  @ApiOperation({ summary: 'Listar backups disponibles (solo ADMIN)' })
  listar() {
    return this.backupService.listarBackups();
  }
}