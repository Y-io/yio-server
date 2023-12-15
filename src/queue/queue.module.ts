import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

import { QueueService } from './queue.service';
import { EmailProcessor } from './email.processor';
import { queueKeys } from './type';

@Module({
  imports: [
    // 注册队列
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          redis: configService.get('REDIS_URL'),
        };
      },
    }),
    // 邮件队列
    BullModule.registerQueue({
      name: queueKeys.EMAIL,
    }),
  ],
  providers: [EmailProcessor, QueueService],
  exports: [QueueService],
})
export class QueueModule {}
