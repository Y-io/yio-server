import { PartialType, PickType } from '@nestjs/mapped-types';
import { NotificationModelDto } from './notification-model.dto';

export class UpdateNotificationDto extends PartialType(PickType(NotificationModelDto, ['title', 'content', 'type'])) {}
