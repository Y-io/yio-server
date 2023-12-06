import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '@/domain/user/user.module';

import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController, AccountController],
  providers: [AuthService, AccountService],
  exports: [AuthService],
})
export class AuthModule {}
