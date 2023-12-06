import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from '@/domain/user/user.service';
import { UserFilterDto } from '@/domain/user/dto/user-pagination.dto';
import { SerializeStrict } from '@/common/decorators/serialize.decorator';
import { UserPaginationSerializeDto, UserSerializeDto } from '@/domain/user/dto/user-serialize.dto';
import { Resource } from '@/common/decorators/resource.decorator';
import { Permission } from '@/common/decorators/permission.decorator';
import { User } from '@/common/decorators/user.decorator';
import { ActionLogger } from '@/common/decorators/action-logger.decorator';

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
  async findMany(@User() user: UserSerializeDto, @Query() dto: UserFilterDto) {
    return this.userService.findMany(dto);
  }
}
