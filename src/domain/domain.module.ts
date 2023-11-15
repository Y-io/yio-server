import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AccountService } from './account/account.service';
import { AccountModule } from './account/account.module';

@Module({
  imports: [UserModule, AuthModule, AccountModule],
  providers: [AccountService],
})
export class DomainModule {}
