import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '@/shared/interceptors/serialize.interceptor';

interface ClassConstructor {
  new (...args: any[]): any;
}

export function Serialize(dto: ClassConstructor, flag = false) {
  return UseInterceptors(new SerializeInterceptor(dto, flag));
}

// 必须加 @Expose() 才会显示
export function SerializeStrict(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
