import { Controller, Get, Request } from '@nestjs/common';
import { AccountService } from '@/domain/account/account.service';
import { AuthRequest } from '@/domain/auth/guards/jwt-auth.guard';
import { SerializeStrict } from '@/common/decorators/serialize.decorator';
import { UserDto } from '@/domain/user/dto/user.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/profile')
  @SerializeStrict(UserDto)
  async profile(@Request() req: AuthRequest) {
    return this.accountService.getProfile(req.user.id);
  }
}
