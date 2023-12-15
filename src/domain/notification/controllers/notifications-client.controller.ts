import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @SerializeStrict(NotificationPaginationResultDto)
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
}
