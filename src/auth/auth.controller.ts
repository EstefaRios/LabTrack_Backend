import { Controller, Post, Body, Req, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginPacienteDto } from './auth.dto';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(AuditInterceptor)
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login-paciente')
  @ApiOperation({ summary: 'Login paciente por tipo, número y fecha de nacimiento' })
  @Audit('LOGIN_PACIENTE')
  async login(@Body() dto: LoginPacienteDto, @Req() req: any) {
    return this.auth.loginPaciente(dto, req.ipAddr || req.ip);
  }
}
