import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ContextType,
  Injectable,
} from '@nestjs/common';
import { Permission } from '@prisma/client';

import { UserModelDto } from '../../domain/user/dto/user-serialize.dto';
import { UserService } from '../../domain/user/user.service';
import { AuthService } from '../../domain/auth/services/auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SUPER_ADMIN } from '../constants';
import { IS_SKIP_AUTH_KEY, PERMISSION_DEF } from '../decorators';

export type AuthRequest = {
  user: UserModelDto;
  authInfo: any;
  route: {
    path: string;
  };
};

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { req } = getRequestResponseFromContext(context);
    const token = req.headers?.authorization ?? '';
    const [type, jwt] = token.split(' ') ?? [];
    const contextType = context.getType<ContextType>();

    if (!token && contextType === 'ws') {
      // ws 必须登录
      return false;
    }

    if (isSkipAuth(context)) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    if (type === 'Bearer') {
      const payload = await this.authService.verifyToken(jwt);

      const user = await this.userService.findUserById(payload.id);

      if (!user) return false;

      request.user = user;

      const roles = await this.prisma.role.findMany({
        where: {
          id: { in: user.roles.map((v) => v.id) },
        },
        include: {
          menus: {
            include: {
              menu: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      const organizations = await this.prisma.role.findMany({
        where: {
          id: { in: user.organizations.map((v) => v.id) },
        },
        include: {
          menus: {
            include: {
              menu: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      const permissions: Permission[] = [];

      roles.forEach((role) => {
        role.menus.forEach((menu) => {
          permissions.push(menu.menu.permission);
        });
      });

      organizations.forEach((organization) => {
        organization.menus.forEach((menu) => {
          permissions.push(menu.menu.permission);
        });
      });

      // 超级管理员
      if (user.username === SUPER_ADMIN) return true;

      if (contextType === 'http') {
        // 如果没有用户信息，不需要检查
        if (!user.roles) return false;

        // 拿到接口权限配置
        const permission: Permission = Reflect.getMetadata(
          PERMISSION_DEF,
          context.getClass().prototype,
          context.getHandler().name,
        );

        // 如果这个接口未设置权限，直接通行
        if (typeof permission === 'undefined') return true;

        // 检查用户是否有权限
        return permissions.some((o) => o.identify === permission.identify);
      }
    }

    return false;
  }
}

export function getRequestResponseFromContext(context: ExecutionContext) {
  switch (context.getType<ContextType>()) {
    case 'http': {
      const http = context.switchToHttp();
      return {
        req: http.getRequest<Request>(),
        res: http.getResponse<Response>(),
      };
    }
    case 'ws': {
      const ws = context.switchToWs();
      const req = ws.getClient().handshake;

      const cookies = req?.headers?.cookie;
      // patch cookies to match auth guard logic
      if (typeof cookies === 'string') {
        req.cookies = cookies
          .split(';')
          .map((v) => v.split('='))
          .reduce(
            (acc, v) => {
              acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
              return acc;
            },
            {} as Record<string, string>,
          );
      }

      return { req };
    }
    default:
      throw new Error('Unknown context type for getting request and response');
  }
}

// 检查 Controller 或者 Class Method 是否需要跳过登录校验
export function isSkipAuth(context: ExecutionContext) {
  return (
    Reflect.getMetadata(IS_SKIP_AUTH_KEY, context.getClass()) ||
    Reflect.getMetadata(IS_SKIP_AUTH_KEY, context.getHandler())
  );
}
