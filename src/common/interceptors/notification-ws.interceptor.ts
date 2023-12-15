import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { filter, Observable } from 'rxjs';
import { Request } from 'express';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthRequest } from '../guards';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationWsInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContextHost, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      filter((notificationEvent) => {
        const httpContext = context.switchToHttp();
        const httpRequest = httpContext.getRequest<Request>();

        const requestUser = httpRequest['user'] as AuthRequest;
        const roleIds = requestUser.user.roles.map((v) => v.id);
        const organizationIds = requestUser.user.organizations.map((v) => v.id);

        // 是否符合用户
        const conformToUser =
          requestUser.user.id &&
          notificationEvent.data.type === NotificationType.USER &&
          notificationEvent.data.recipientId === requestUser.user.id;

        // 是否符合角色
        const conformToRole =
          roleIds.length &&
          notificationEvent.data.type === NotificationType.ROLE &&
          roleIds.some((v) => v === notificationEvent.data.recipientId);

        // 是否符合组织
        const conformToOrganization =
          organizationIds.length &&
          notificationEvent.data.type === NotificationType.ORGANIZATION &&
          organizationIds.some((v) => v === notificationEvent.data.recipientId);

        // 给所有人通知
        const toAll = notificationEvent.data.type === NotificationType.ALL;

        return conformToUser || conformToRole || conformToOrganization || toAll;
      }),
    );
  }
}
