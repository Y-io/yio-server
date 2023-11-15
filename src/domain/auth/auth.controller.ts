import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/domain/auth/auth.service';
import { SignInDto } from '@/domain/auth/dto/sign-in.dto';
import { SignUpDto } from '@/domain/auth/dto/sign-up.dto';
import { ShipAuth } from '@/domain/auth/guards/skip-auth';

@ShipAuth()
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
