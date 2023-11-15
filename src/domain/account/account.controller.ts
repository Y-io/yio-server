import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AccountService } from '@/domain/account/account.service';
import { AuthRequest, JwtAuthGuard } from '@/domain/auth/guards/jwt-auth.guard';
import { SerializeStrict } from '@/common/decorators/serialize.decorator';
import { UserSerializeDto } from '@/domain/user/dto/user-serialize.dto';

@SerializeStrict(UserSerializeDto)
@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/profile')
  async profile(@Request() req: AuthRequest) {
    return this.accountService.getProfile(req.user.id);
  }
}
