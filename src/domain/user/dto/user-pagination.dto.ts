import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@/shared/dto/base.dto';

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

export class UserFilterDto extends PaginationDto {
  @Type(() => OrderByType)
  @ValidateNested()
  @IsOptional()
  orderBy: OrderByType;

  @Type(() => UserSearch)
  @ValidateNested()
  @IsOptional()
  search: UserSearch;
}
