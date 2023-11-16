import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from '@/domain/user/user.service';
import { UserPaginationDto } from '@/domain/user/dto/user-pagination.dto';
import { SerializeStrict } from '@/common/decorators/serialize.decorator';
import { UserPaginationSerializeDto } from '@/domain/user/dto/user-serialize.dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @SerializeStrict(UserPaginationSerializeDto)
  async findMany(@Query() dto: UserPaginationDto) {
    return this.userService.findMany(dto);
  }
}
