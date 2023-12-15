import { PickType } from '@nestjs/mapped-types';
import { NotificationModelDto } from './notification-model.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateNotificationDto extends PickType(NotificationModelDto, [
  'title',
  'content',
  'publishTime',
  'type',
  'recipientId',
  'source',
  'managerId',
]) {
  // 是否立即发布
  @IsOptional()
  @IsBoolean()
  isPublish: boolean;
}
