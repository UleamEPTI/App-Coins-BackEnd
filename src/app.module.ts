import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { PremiosModule } from './premios/premios.module';
import { PuntosModule } from './puntos/puntos.module';
import { CanjesModule } from './canjes/canjes.module';
import { InstitucionesModule } from './instituciones/instituciones.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { TiposBotellaModule } from './tipos-botella/tipos-botella.module';
import { ReciclajesModule } from './reciclajes/reciclajes.module';
import { ReportesModule } from './reportes/reportes.module';
import { BackupModule } from './backup/backup.module';
import { SolicitudesPasswordModule } from './solicitudes-password/solicitudes-password.module';
import { CursosModule } from './cursos/cursos.module';
import { VersionModule } from './version/version.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        port: parseInt(configService.get<string>('DB_PORT') ?? '5432'),
        username: configService.get<string>('DB_USERNAME') ?? 'postgres',
        password: configService.get<string>('DB_PASSWORD') ?? '',
        database: configService.get<string>('DB_NAME') ?? 'bachillero_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsuariosModule,
    EstudiantesModule,
    PremiosModule,
    PuntosModule,
    CanjesModule,
    InstitucionesModule,
    EstadisticasModule,
    AuditoriaModule,
    TiposBotellaModule,
    ReciclajesModule,
    ReportesModule,
    BackupModule,
    SolicitudesPasswordModule,
    CursosModule,
    VersionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}