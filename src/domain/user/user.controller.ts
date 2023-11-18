import { Controller, Get, Query, Request } from '@nestjs/common';
import { UserService } from '@/domain/user/user.service';
import { UserFilterDto } from '@/domain/user/dto/user-pagination.dto';
import { SerializeStrict } from '@/shared/decorators/serialize.decorator';
import { UserPaginationSerializeDto } from '@/domain/user/dto/user-serialize.dto';
import { Resource } from '@/shared/decorators/resource.decorator';
import { Permission } from '@/shared/decorators/permission.decorator';
import { AuthRequest } from '@/domain/auth/guards/jwt-auth.guard';

import { SuperAdminName } from '@/shared/constants';

@Resource({
  name: 'users_manage',
  identify: 'users:manage',
})
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Permission({
    name: 'find_users',
    identify: 'users:find_users',
    action: 'find',
  })
  @Get()
  @SerializeStrict(UserPaginationSerializeDto)
  async findMany(@Request() req: AuthRequest, @Query() dto: UserFilterDto) {
    const include = {};

    if (req.user.username !== SuperAdminName) {
    }

    return this.userService.findMany({
      ...dto,
      include,
    });
  }
}
