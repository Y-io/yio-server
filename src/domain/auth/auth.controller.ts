import { Controller, Post } from '@nestjs/common';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  @Post('register')
  async register() {}

  @Post('login')
  async signIn() {}
}
