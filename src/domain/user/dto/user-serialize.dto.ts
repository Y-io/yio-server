import { Expose, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { PaginationSerializeDto } from '@/common/dto/base.dto';
import { Organization, Role } from '@prisma/client';

export class UserSerializeDto {
  @IsOptional()
  @Expose()
  id: string;

  @Expose()
  @IsOptional()
  username: string;

  @Expose()
  @IsOptional()
  email: string;

  @Expose()
  roles: Role[];

  @Expose()
  organizations: Organization[];
}

export class UserPaginationSerializeDto extends PaginationSerializeDto {
  @Type(() => UserSerializeDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: UserSerializeDto[];
}
