import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Permission, Resource, SerializeStrict, User } from '../../common/decorators';
import { UserPaginationSerializeDto, UserSerializeDto } from './dto/user-serialize.dto';
import { UserFilterDto } from './dto/user-pagination.dto';

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
