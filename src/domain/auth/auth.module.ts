import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController, AccountController],
  providers: [AuthService, AccountService],
  exports: [AuthService],
})
export class AuthModule {}
