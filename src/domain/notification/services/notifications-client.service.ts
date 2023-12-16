import { Injectable } from '@nestjs/common';
import { NotificationBaseService } from './notification-base.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationFilterDto } from '../dto/notification-pagination.dto';
import { paginationHelper, whereInputHelper } from '../../../common/utils/many-helper';

@Injectable()
export class NotificationsClientService {
  constructor(
    private notificationBaseService: NotificationBaseService,
    private prisma: PrismaService,
  ) {}

  async findUserUnReadNotifications(userId: string) {
    return this.notificationBaseService.findUserUnReadNotifications(userId);
  }

  async findUnique(userId: string, id: string) {
    return this.notificationBaseService.findUserUnDeletedNotification(userId, id);
  }
  async findMany(userId: string, dto: NotificationFilterDto) {
    const pagination = paginationHelper(dto.page, dto.pageSize);
    const where = whereInputHelper(dto.filter);
    return this.notificationBaseService.findMany({
      ...pagination,
      orderBy: dto.orderBy,
      where: {
        ...where,
        deletedAt: null,
        users: {
          some: {
            userId,
            deletedAt: null,
          },
        },
      },
    });
  }
  async delete(id: string, userId: string) {
    return this.notificationBaseService.userDeleteNotification(id, userId);
  }
}
