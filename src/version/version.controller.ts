import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Version')
@Controller('version')
export class VersionController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener versión actual del backend' })
  getVersion() {
    return {
      version: this.configService.get<string>('APP_VERSION') ?? '1.0.0',
      fecha: new Date().toISOString(),
    };
  }
}