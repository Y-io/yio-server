import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_SKIP_AUTH_KEY } from '../decorators/skip-auth.decorator';
import { UserEntity } from '@/domain/user/user.entity';

export type AuthRequest = {
  user: UserEntity;
  authInfo: any;
  route: {
    path: string;
  };
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // handleRequest(err, user, info) {
  //   console.log({ err, user, info });
  //   return user;
  // }

  // The inferred type of 'canActivate' cannot be named without a reference to '.pnpm/rxjs@7.8.1/node_modules/rxjs'. This is likely not portable.  A type annotation is necessary.
  // 遇到以上问题在 tsconfig.json compilerOptions 中配置 preserveSymlinks 为 true
  canActivate(context: ExecutionContext) {
    if (isSkipAuth(context)) {
      return true;
    }

    return super.canActivate(context);
  }
}

// 检查 Controller 或者 Class Method 是否需要跳过登录校验
export function isSkipAuth(context: ExecutionContext) {
  return (
    Reflect.getMetadata(IS_SKIP_AUTH_KEY, context.getClass()) ||
    Reflect.getMetadata(IS_SKIP_AUTH_KEY, context.getHandler())
  );
}
