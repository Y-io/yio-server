import { IsBoolean, IsEnum, IsOptional, IsString, IsTimeZone } from 'class-validator';
import { NotificationSource, NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  title: string;
  @IsString()
  content: string;

  // 是否立即发布
  @IsOptional()
  @IsBoolean()
  isPublish: boolean;

  // 通知发布时间
  @IsTimeZone()
  @IsOptional()
  publishTime?: Date;
  // 通知类型（接受通知的对象），用户通知，角色通知，组织通知
  @IsEnum(NotificationType)
  type: NotificationType;
  // 接受通知的对象 id，如果是系统通知，就是所有用户（可为'all'），如果指定了 id,根据 type 判断是哪个群体或某用户
  @IsString()
  recipientId: string;
  // 通知来源，系统通知，用户通知，其他通知
  @IsEnum(NotificationSource)
  source: NotificationSource;
  // 消息发布人
  @IsString()
  managerId: string;
}
