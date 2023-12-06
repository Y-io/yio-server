import { BigintTransformInterceptor } from '@/common/interceptors/bigint-transform.interceptor';
import { UseInterceptors } from '@nestjs/common';

export function BigintTransform() {
  return UseInterceptors(new BigintTransformInterceptor());
}
