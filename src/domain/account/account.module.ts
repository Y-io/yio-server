import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { UserModule } from '@/domain/user/user.module';
import { AccountService } from '@/domain/account/account.service';

@Module({
  imports: [UserModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
