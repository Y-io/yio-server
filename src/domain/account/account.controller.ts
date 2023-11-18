import { Controller, Get, Request } from '@nestjs/common';
import { AccountService } from '@/domain/account/account.service';
import { AuthRequest } from '@/shared/guards/jwt-auth.guard';
import { SerializeStrict } from '@/shared/decorators/serialize.decorator';

import { Resource } from '@/shared/decorators/resource.decorator';
import { UserSerializeDto } from '@/domain/user/dto/user-serialize.dto';

@Resource({
  name: 'account',
  identify: 'account:manage',
})
@Controller({
  path: 'account',
  version: '1',
})
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/profile')
  @SerializeStrict(UserSerializeDto)
  async accountProfile(@Request() req: AuthRequest) {
    return this.accountService.getProfile(req.user.id);
  }
}
