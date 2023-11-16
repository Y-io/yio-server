import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationSerializeDto } from '@/shared/dto/base.dto';
import { UserDto } from '@/domain/user/dto/user.dto';

export class UserPaginationSerializeDto extends PaginationSerializeDto {
  @Type(() => UserDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: UserDto[];
}
