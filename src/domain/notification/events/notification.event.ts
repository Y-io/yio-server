import { Notification } from '@prisma/client';

export class NotificationEvent {
  constructor(readonly data: Notification) {}
}
