import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationSerializeDto } from '@/shared/dto/base.dto';

import { UserEntity } from '@/domain/user/user.entity';

export class UserSerializeDto extends UserEntity {
  // @IsOptional()
  // @Expose()
  // id: string;
  //
  // @Expose()
  // @IsOptional()
  // username: string;
  //
  // @Expose()
  // @IsOptional()
  // email: string;
  //
  // @Expose()
  // roles: any;
  //
  // @Expose()
  // organizations: any;
}

export class UserPaginationSerializeDto extends PaginationSerializeDto {
  @Type(() => UserSerializeDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: UserSerializeDto[];
}
