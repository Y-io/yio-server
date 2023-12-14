import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from '@/domain/auth/services/auth.service';
import { EmailLoginDto, LoginDto } from '@/domain/auth/dto/login.dto';
import { RegisterDto } from '@/domain/auth/dto/register.dto';
import { SkipAuth } from '@/common/decorators/skip-auth.decorator';

@SkipAuth()
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async signIn(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('email_login_code/:email')
  async sendEmailLogin(@Param('email') email: string) {
    await this.authService.sendEmailLoginCode(email);
    return 'ok';
  }

  @Post('email_login')
  async emailLogin(@Body() dto: EmailLoginDto) {}
}
