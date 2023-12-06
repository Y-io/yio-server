import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PERMISSION_DEF } from '@/common/decorators/permission.decorator';
import { SUPER_ADMIN } from '@/common/constants';
import { Permission } from '@prisma/client';
import { isSkipAuth } from '@/common/guards/jwt.guard';

export class PermissionGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (isSkipAuth(context)) {
      return true;
    }

    // 如果没有用户信息，不需要检查
    if (!user) return false;

    // 超级管理员
    if (user.username === SUPER_ADMIN) return true;

    // 拿到接口权限配置
    const permission: Permission = Reflect.getMetadata(
      PERMISSION_DEF,
      context.getClass().prototype,
      context.getHandler().name,
    );

    // 如果这个接口未设置权限，直接通行
    if (typeof permission === 'undefined') return true;

    // 检查用户是否有权限
    return user.organizations.some((o) => o.identify === permission.identify);
  }
}
