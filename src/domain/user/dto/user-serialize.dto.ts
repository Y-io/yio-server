import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Organization, Role } from '@prisma/client';
import { BaseModelDto, PaginationResultDto } from '../../../common/dto/base.dto';

export class UserModelDto extends BaseModelDto {
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

export class UserPaginationSerializeDto extends PaginationResultDto {
  @Type(() => UserModelDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: UserModelDto[];
}
