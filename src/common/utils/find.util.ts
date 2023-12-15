import { paginationHelper } from './many-helper';
import { FilterDto } from '../dto/base.dto';

export function filterDtoToArgs(dto: FilterDto) {
  const pagination = paginationHelper(dto.page, dto.pageSize);

  const countArgs = {
    orderBy: dto.orderBy,
  };

  const findManyArgs = {
    ...pagination,
    ...countArgs,
  };

  return {
    findManyArgs,
    countArgs,
  };
}
