import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Organization, Role } from '@prisma/client';
import { PaginationSerializeDto } from '../../../common/dto/base.dto';

export class UserModelDto {
  @IsOptional()
  @Expose()
  id: string;

  @IsString()
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
  @Type(() => UserModelDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: UserModelDto[];
}
