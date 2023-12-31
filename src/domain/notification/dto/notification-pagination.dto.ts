import { FilterDto, PaginationResultDto } from '../../../common/dto/base.dto';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { NotificationManageModelDto } from './notification-manage-model.dto';
import { NotificationModelDto } from './notification-model.dto';

export class NotificationPaginationResultDto extends PaginationResultDto {
  @Type(() => NotificationModelDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: NotificationModelDto[];
}

export class NotificationManagePaginationResultDto extends PaginationResultDto {
  @Type(() => NotificationManageModelDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: NotificationManageModelDto[];
}

export class NotificationFilterDto extends FilterDto {}
