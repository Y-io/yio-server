import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

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

export class PaginationSerializeDto extends PaginationDto {
  @Expose()
  count: number;
}
