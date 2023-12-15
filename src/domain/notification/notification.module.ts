import { Global, Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationBaseService } from './services/notification-base.service';
import { NotificationsManageController } from './controllers/notifications-manage.controller';
import { NotificationsClientController } from './controllers/notifications-client.controller';

@Global()
@Module({
  imports: [],
  controllers: [NotificationsClientController, NotificationsManageController],
  providers: [NotificationBaseService, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
