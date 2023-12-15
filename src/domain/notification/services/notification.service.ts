import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { filter, fromEvent } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { EventsGateway } from '../../../events/events.gateway';
import { NotificationType, Prisma } from '@prisma/client';
import { NotificationSubscribeGroup } from '../types';
import { NotificationEvent } from '../events/notification.event';

const notificationEvent = 'notification-event';

@Injectable()
export class NotificationService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { isPublish, ...dto } = createNotificationDto;
    let userIds: string[];
    if (dto.type === NotificationType.USER) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: dto.recipientId,
        },
      });
      userIds = [user.id];
    } else if (dto.type === NotificationType.ROLE) {
      const users = await this.prisma.user.findMany({
        where: {
          roles: {
            some: {
              roleId: dto.recipientId,
            },
          },
        },
      });
      userIds = users.map((v) => v.id);
    } else if (dto.type === NotificationType.ORGANIZATION) {
      const users = await this.prisma.user.findMany({
        where: {
          organizations: {
            some: {
              organizationId: dto.recipientId,
            },
          },
        },
      });
      userIds = users.map((v) => v.id);
    }

    const notification = await this.prisma.notification.create({
      data: {
        ...dto,
        users: {
          create: userIds.map((userId) => ({
            userId,
          })),
        },
      },
    });

    // 如果立即发布的话，给订阅的用户通知
    if (isPublish) {
      void this.eventsGateway.sendNotification(notification);
    }

    return notification;
  }

  // 发布某条通知
  async publish(id: string) {
    const notification = await this.findOne(id);

    await this.eventsGateway.sendNotification(notification);
    return notification;
  }

  async findAll(userId?: string) {
    let where: Prisma.NotificationWhereInput;
    if (userId) {
      where = {
        users: {
          some: {
            userId: userId,
          },
        },
      };
    }

    return this.prisma.notification.findMany({
      where,
      skip: 0,
      take: 10,
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: id,
      },
    });

    if (!notification) throw new NotFoundException('通知不存在');

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: {
        id: id,
      },
      data: updateNotificationDto,
    });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }

  // 获取用户最新通知
  async findUserLatestNotification(userId: string) {
    const list = await this.prisma.notification.findMany({
      where: {
        users: {
          some: {
            userId: userId,
            isRead: false,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return list;
  }

  // 获取用户通知列表列表
  async findUserNotifications(userId: string) {
    const list = await this.prisma.notification.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return list;
  }

  subscribe(group: NotificationSubscribeGroup) {
    const source = fromEvent<NotificationEvent>(this.eventEmitter, notificationEvent);

    return source.pipe(
      filter((notificationEvent) => {
        // 是否符合用户
        const conformToUser =
          group.userId &&
          notificationEvent.data.type === NotificationType.USER &&
          notificationEvent.data.recipientId === group.userId;

        // 是否符合角色
        const conformToRole =
          group.roleIds &&
          notificationEvent.data.type === NotificationType.ROLE &&
          group?.roleIds?.some((v) => v === notificationEvent.data.recipientId);

        // 是否符合组织
        const conformToOrganization =
          group.organizationIds &&
          notificationEvent.data.type === NotificationType.ORGANIZATION &&
          group.organizationIds.some((v) => v === notificationEvent.data.recipientId);

        // 给所有人通知
        const toAll = notificationEvent.data.type === NotificationType.ALL;

        return conformToUser || conformToRole || conformToOrganization || toAll;
      }),
    );
  }
}
