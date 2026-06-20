import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Ver perfil del usuario autenticado' })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('refresh')
  @ApiOperation({ summary: 'Renovar token JWT' })
  refresh(@Request() req: any) {
    return this.authService.refreshToken(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('cambiar-password')
  @ApiOperation({ summary: 'Usuario cambia su propia contraseña (obligatorio en primer login)' })
  cambiarPassword(
    @Request() req: any,
    @Body('password_actual') passwordActual: string,
    @Body('password_nueva') passwordNueva: string,
  ) {
    return this.authService.cambiarPasswordPropia(req.user.id, passwordActual, passwordNueva);
  }
}