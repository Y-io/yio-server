import { Controller, Get, Request } from '@nestjs/common';
import { AccountService } from '@/domain/auth/services/account.service';
import { SerializeStrict } from '@/common/decorators/serialize.decorator';

import { Resource } from '@/common/decorators/resource.decorator';
import { UserSerializeDto } from '@/domain/user/dto/user-serialize.dto';
import { AuthRequest } from '@/common/guards';
import { ActionLogger } from '@/common/decorators';

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
  @ActionLogger({
    template: '<%= username %> 请求了用户详情',
    keys: ['username'],
  })
  async accountProfile(@Request() req: AuthRequest) {
    return this.accountService.getProfile(req.user.id);
  }
}
