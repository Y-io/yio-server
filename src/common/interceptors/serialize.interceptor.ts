import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: any,
    private excludeExtraneousValues = true,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto, data, {
          // true --> 必须加 @Expose() 才会显示
          // false --> 加 @Exclude() 才会被排除
          excludeExtraneousValues: this.excludeExtraneousValues,
        });
      }),
    );
  }
}
