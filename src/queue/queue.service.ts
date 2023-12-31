import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '@prisma/client';
import { emailAction, EmailType, queueKeys } from './type';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(queueKeys.EMAIL) private readonly emailQueue: Queue) {}

  async sendWelcomeEmail(data: EmailType<User>) {
    const job = await this.emailQueue.add(emailAction.WELCOME_EMAIL, data);
    return { jobId: job.id };
  }
}
