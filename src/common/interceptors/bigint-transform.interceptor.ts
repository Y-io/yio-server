import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export function serializeBigInt(data: unknown) {
  if (typeof data === 'bigint') {
    return data.toString();
  }
  if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      data[key] = serializeBigInt(data[key]);
    }
  }

  return data;
}

@Injectable()
export class BigintTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return serializeBigInt(data);
      }),
    );
  }
}
