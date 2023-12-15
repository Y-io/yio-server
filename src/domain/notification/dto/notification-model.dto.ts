import { IsEnum, IsOptional, IsString, IsTimeZone } from 'class-validator';
import { Expose } from 'class-transformer';
import { NotificationSource, NotificationType } from '@prisma/client';

export class NotificationModelDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  content: string;

  // 通知发布时间
  @Expose()
  @IsTimeZone()
  @IsOptional()
  publishTime?: Date;

  // 通知类型（接受通知的对象），用户通知，角色通知，组织通知
  @Expose()
  @IsEnum(NotificationType)
  type: NotificationType;

  // 接受通知的对象 id，如果是系统通知，就是所有用户（可为'all'），如果指定了 id,根据 type 判断是哪个群体或某用户
  @Expose()
  @IsString()
  recipientId: string;

  // 通知来源，系统通知，用户通知，其他通知
  @Expose()
  @IsEnum(NotificationSource)
  source: NotificationSource;

  // 消息发布人
  @Expose()
  @IsString()
  managerId: string;
}
