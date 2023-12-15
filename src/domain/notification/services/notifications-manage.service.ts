import { Injectable } from '@nestjs/common';
import { NotificationBaseService } from './notification-base.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { paginationHelper, whereInputHelper } from '../../../common/utils/many-helper';
import { NotificationFilterDto } from '../dto/notification-pagination.dto';

@Injectable()
export class NotificationsManageService {
  constructor(private notificationBaseService: NotificationBaseService) {}

  /**
   * 查找通知
   */
  async findUnique(id: string) {
    return this.notificationBaseService.findOne(id);
  }

  /**
   * 查找多个通知
   */
  async findMany(userId: string, dto: NotificationFilterDto) {
    const pagination = paginationHelper(dto.page, dto.pageSize);
    const where = whereInputHelper(dto.filter);
    return this.notificationBaseService.findMany({
      ...pagination,
      orderBy: dto.orderBy,
      where: where,
    });
  }

  /**
   * 创建通知
   */
  async create(data: CreateNotificationDto) {
    return this.notificationBaseService.create(data);
  }

  /**
   * 更新通知
   */
  async update(id: string, data: UpdateNotificationDto) {
    return this.notificationBaseService.update(id, data);
  }

  /**
   * 删除通知
   */
  async delete(id: string) {
    return this.notificationBaseService.delete(id);
  }

  /**
   * 发布通知
   */
  async publish(id: string) {
    return this.notificationBaseService.publish(id);
  }
}
