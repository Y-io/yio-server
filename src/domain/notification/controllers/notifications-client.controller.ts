import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { Permission, Resource, SerializeStrict, User } from '../../../common/decorators';
import { NotificationsClientService } from '../services/notifications-client.service';
import { NotificationModelDto } from '../dto/notification-model.dto';
import { NotificationFilterDto, NotificationPaginationResultDto } from '../dto/notification-pagination.dto';

@Resource({ name: 'notifications_client', identify: 'notifications:client' })
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsClientController {
  constructor(private notificationClientService: NotificationsClientService) {}

  @SerializeStrict(NotificationModelDto)
  @Permission({
    name: 'latest_unread_notifications',
    identify: 'notifications_client:latest_unread_notifications',
    action: 'find',
  })
  @Get('latest-unread')
  async latest(@User('id') userId: string) {
    return this.notificationClientService.findUserUnReadNotifications(userId);
  }

  @SerializeStrict(NotificationPaginationResultDto)
  @Permission({ name: 'find_notifications', identify: 'notifications_client:find_notifications', action: 'find' })
  @Get()
  async findMany(@User('id') userId: string, @Query() dto: NotificationFilterDto) {
    return this.notificationClientService.findMany(userId, dto);
  }

  @SerializeStrict(NotificationModelDto)
  @Permission({ name: 'find_notifications', identify: 'notifications_client:find_notifications', action: 'find' })
  @Get(':id')
  async findUnique(@Param('id') id: string, @User('id') userId: string) {
    return this.notificationClientService.findUnique(id, userId);
  }

  @Permission({ name: 'delete_notification', identify: 'notifications_client:delete_notification', action: 'delete' })
  @Delete(':id')
  async delete(@Param('id') id: string, @User('id') userId: string) {
    await this.notificationClientService.delete(id, userId);
    return 'ok';
  }
}
