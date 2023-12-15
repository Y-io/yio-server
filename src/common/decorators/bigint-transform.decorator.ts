import { UseInterceptors } from '@nestjs/common';
import { BigintTransformInterceptor } from '../interceptors/bigint-transform.interceptor';

export function BigintTransform() {
  return UseInterceptors(new BigintTransformInterceptor());
}
