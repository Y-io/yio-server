import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '@/domain/user/dto/user.dto';
import { PaginationDto } from '@/shared/dto/base.dto';

class OrderByType {
  [key: string]: 'asc' | 'desc';
}

export class UserPaginationDto extends PaginationDto {
  @Type(() => OrderByType)
  @ValidateNested()
  @IsOptional()
  orderBy: OrderByType;

  @Type(() => UserDto)
  @ValidateNested()
  @IsOptional()
  filter: UserDto;
}
