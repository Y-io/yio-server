import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Permission, Resource, SerializeStrict, User } from '../../../common/decorators';
import { NotificationsManageService } from '../services/notifications-manage.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { NotificationManageModelDto } from '../dto/notification-manage-model.dto';
import { NotificationFilterDto, NotificationManagePaginationResultDto } from '../dto/notification-pagination.dto';

@Resource({ name: 'notifications_manage', identify: 'notifications:manage' })
@Controller({
  path: 'notifications-manage',
  version: '1',
})
export class NotificationsManageController {
  constructor(private readonly notificationManageService: NotificationsManageService) {}

  @SerializeStrict(NotificationManageModelDto)
  @Permission({ name: 'create_notification', identify: 'notifications-manage:create_notification', action: 'create' })
  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationManageService.create(dto);
  }

  @SerializeStrict(NotificationManagePaginationResultDto)
  @Permission({ name: 'find_notifications', identify: 'notifications-manage:find_notifications', action: 'find' })
  @Get()
  async findMany(@User('id') userId: string, @Query() dto: NotificationFilterDto) {
    return this.notificationManageService.findMany(dto);
  }

  @SerializeStrict(NotificationManageModelDto)
  @Permission({ name: 'find_notification', identify: 'notifications-manage:find_notification', action: 'find' })
  @Get(':id')
  async findUnique(@Param('id') id: string) {
    return this.notificationManageService.findUnique(id);
  }

  @SerializeStrict(NotificationManageModelDto)
  @Permission({ name: 'update_notification', identify: 'notifications-manage:update_notification', action: 'update' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    return this.notificationManageService.update(id, dto);
  }

  @SerializeStrict(NotificationManageModelDto)
  @Permission({ name: 'delete_notification', identify: 'notifications-manage:delete_notification', action: 'delete' })
  @Delete('id')
  async delete(@Param('id') id: string) {
    return this.notificationManageService.delete(id);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    await this.notificationManageService.publish(id);
    return 'ok';
  }
}
