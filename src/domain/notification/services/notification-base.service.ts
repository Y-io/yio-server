import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Notification, NotificationType, Prisma } from '@prisma/client';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { EventsGateway } from '../../../events/events.gateway';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationBaseService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  /**
   * 创建通知
   */
  async create(dto: CreateNotificationDto) {
    const { isPublish, ...data } = dto;
    let userIds: string[] = [];
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
        ...data,
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

  /**
   * 查找通知
   */
  async findUnique(args: Prisma.NotificationFindUniqueArgs) {
    const notification = await this.prisma.notification.findUnique(args);

    if (!notification) throw new NotFoundException('通知不存在');

    return notification;
  }

  /**
   * 查找通知
   */
  async findOne(id: string) {
    return this.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * 查找用户未删除的通知
   */
  async findUserUnDeletedNotification(id: string, userId: string) {
    return this.prisma.notification.findUnique({
      where: {
        id,
        users: {
          some: {
            userId,
            deletedAt: null,
          },
        },
        deletedAt: null,
      },
    });
  }

  /**
   * 查找多个通知
   */
  async findMany(args: Prisma.NotificationFindManyArgs) {
    const countArgs: Prisma.NotificationCountArgs = {
      where: args.where,
      skip: args.skip,
      take: args.take,
      cursor: args.cursor,
      orderBy: args.orderBy,
    };

    const [list, count] = await this.prisma.$transaction([
      this.prisma.notification.findMany(args),
      this.prisma.notification.count(countArgs),
    ]);

    return { list, count };
  }

  /**
   * 查找用户未读通知
   * @param userId
   */
  async findUserUnReadNotifications(userId: string) {
    return this.findMany({
      where: {
        users: {
          some: {
            userId,
            deletedAt: null,
          },
        },
        deletedAt: null,
      },
    });
  }

  /**
   * 查找用户通知
   */
  async findUserNotifications(userId: string) {
    return this.findMany({
      where: {
        users: {
          some: {
            userId,
            deletedAt: null,
          },
        },
        deletedAt: null,
      },
    });
  }

  /**
   * 更新通知
   */
  async update(id: string, data: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * 删除通知
   */
  async delete(id: string, userId?: string) {
    return this.prisma.notification.delete({
      where: {
        id,
        users: {
          some: {
            userId,
          },
        },
      },
    });
  }

  /**
   * 发布通知
   */
  async publish(data: string | Notification) {
    if (typeof data === 'string') {
      const notification = await this.findOne(data);
      await this.eventsGateway.sendNotification(notification);
    } else {
      await this.eventsGateway.sendNotification(data);
    }
  }
}
