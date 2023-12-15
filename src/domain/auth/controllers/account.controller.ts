import { Controller, Get, Request } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { Resource, SerializeStrict } from '../../../common/decorators';
import { UserModelDto } from '../../user/dto/user-serialize.dto';
import { AuthRequest } from '../../../common/guards';

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
  @SerializeStrict(UserModelDto)
  async accountProfile(@Request() req: AuthRequest) {
    return this.accountService.getProfile(req.user.id);
  }
}
