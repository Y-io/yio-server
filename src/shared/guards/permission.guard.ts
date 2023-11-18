import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_DEF } from '@/shared/decorators/permission.decorator';
import { PermissionEntity } from '@/domain/system-module/entities/permission.entity';
import { UserEntity } from '@/domain/user/user.entity';
import { SUPER_ADMIN } from '@/shared/constants';

export class PermissionGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    // 如果没有用户信息，不需要检查
    if (!user) return true;

    // 超级管理员
    if (user.username === SUPER_ADMIN) return true;

    // 拿到接口权限配置
    const permission: PermissionEntity = Reflect.getMetadata(
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
