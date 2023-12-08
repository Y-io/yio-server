import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';
import { User } from '@prisma/client';
import { EmailType, queueKeys } from '@/queue/type';

@Processor(queueKeys.EMAIL)
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}

  // 注册成功
  @Process('welcome')
  async sendWelcomeEmail(job: Job<EmailType<User>>) {
    const { data } = job;

    await this.mailService.sendMail({
      ...data,
      subject: 'Welcome',
      template: 'welcome',
      context: {
        user: data.user,
      },
    });
  }
}
