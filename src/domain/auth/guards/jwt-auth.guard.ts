import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_SKIP_AUTH_KEY } from './skip-auth';
import { User } from '@prisma/client';

export type AuthRequest = {
  user: User;
  authInfo: any;
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
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
