import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Permission, Resource, SerializeStrict, User } from '../../common/decorators';
import { UserPaginationSerializeDto, UserModelDto } from './dto/user-serialize.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Permission({ name: 'find_users', identify: 'users:find_users', action: 'find' })
  @Get()
  @SerializeStrict(UserPaginationSerializeDto)
  async findMany(@User() user: UserModelDto, @Query() dto: FindUsersDto) {
    return this.userService.findMany(dto);
  }

  @Permission({ name: 'find_user', identify: 'users:find_user', action: 'find' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Permission({ name: 'create_user', identify: 'users:create_user', action: 'create' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Permission({ name: 'update_user', identify: 'users:update_user', action: 'update' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Permission({ name: 'delete_user', identify: 'users:delete_user', action: 'delete' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
