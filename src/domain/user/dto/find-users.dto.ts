import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginationDto } from '../../../common/dto/base.dto';
import { Type } from 'class-transformer';

class OrderByType {
  [key: string]: 'asc' | 'desc';
}

class UserSearch {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  organization: string;
}

export class FindUsersDto extends PaginationDto {
  @Type(() => OrderByType)
  @ValidateNested()
  @IsOptional()
  orderBy: OrderByType;

  @Type(() => UserSearch)
  @ValidateNested()
  @IsOptional()
  search: UserSearch;
}
