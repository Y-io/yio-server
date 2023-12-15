import { Expose, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, ValidateNested } from 'class-validator';

export class BaseModelDto {
  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;

  @Expose()
  @IsDate()
  @IsOptional()
  deletedAt: Date;
}

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @Expose()
  page: number = 1;

  @IsNumber()
  @Type(() => Number)
  @Expose()
  pageSize: number = 10;
}

export class PaginationResultDto extends PaginationDto {
  @Expose()
  count: number;
}

export class OrderByType {
  [key: string]: 'asc' | 'desc';
}

export class SearchType {
  [key: string]: string | number;
}

export class FilterDto extends PaginationDto {
  @Type(() => OrderByType)
  @ValidateNested()
  @IsOptional()
  orderBy: OrderByType;

  @Type(() => SearchType)
  @ValidateNested()
  @IsOptional()
  filter: SearchType;
}
