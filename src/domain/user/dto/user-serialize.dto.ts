import { Expose, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { PaginationSerializeDto } from '@/shared/dto/base.dto';

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
  roles: any;

  @Expose()
  organizations: any;
}

export class UserPaginationSerializeDto extends PaginationSerializeDto {
  @Type(() => UserSerializeDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: UserSerializeDto[];
}
