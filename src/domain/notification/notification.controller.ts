import { Controller, Get, Post, Body, Patch, Param, Delete, Sse, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthRequest } from '@/common/guards';
import { Permission, Resource } from '@/common/decorators';
import { NotificationSubscribeGroup } from '@/domain/notification/types';

@Resource({ name: 'notifications_manage', identify: 'notifications:manage' })
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('subscribe')
  subscribe(@Request() req: AuthRequest) {
    const subscribeGroup: NotificationSubscribeGroup = {
      userId: req.user.id,
      // roleId:req.user.
    };
    return this.notificationService.subscribe(subscribeGroup);
  }

  @Permission({
    name: 'create_notification',
    identify: 'notifications:create_notification',
    action: 'create',
  })
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Permission({
    name: 'publish_notification',
    identify: 'notifications:publish_notification',
    action: 'update',
  })
  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.notificationService.publish(id);
  }

  @Permission({
    name: 'find_notifications',
    identify: 'notifications:find_notifications',
    action: 'find',
  })
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Permission({
    name: 'find_notification',
    identify: 'notifications:find_notification',
    action: 'find',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Permission({
    name: 'update_notification',
    identify: 'notifications:update_notification',
    action: 'update',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Permission({
    name: 'delete_notification',
    identify: 'notifications:delete_notification',
    action: 'delete',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
