import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MurLockModule } from 'murlock';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { MurLockModuleOptions } from 'murlock/dist/interfaces/murlock-options.interface';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { envValidation } from './common/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';
import { JwtGuard } from './common/guards';
import { HttpExceptionFilter } from './common/filters';
import { HttpExceptionInterceptor } from './common/interceptors/http-exception.interceptor';

function createDailyRotateTransport(level: string, filename: string) {
  return new DailyRotateFile({
    level: level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidation,
    }),
    // 速率限制
    ThrottlerModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        storage: new ThrottlerStorageRedisService(redisService.getClient()),
        throttlers: [
          {
            ttl: 60000,
            limit: 10,
          },
        ],
      }),
    }),
    // db
    PrismaModule,
    // redis
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          url: configService.get('REDIS_URL'),
        },
      }),
    }),
    // 事件通信
    EventEmitterModule.forRoot(),
    // redis 分布式事务锁
    MurLockModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          redisOptions: {
            url: configService.get('REDIS_URL'),
          },
        } as MurLockModuleOptions;
      },
    }),
    // 邮件
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.example.com',
          port: 587,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
        },
      }),
    }),
    // 日志
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async () => {
        // const isProEnv = configService.get('ENVIRONMENT') === 'production';
        const transportList = [
          createDailyRotateTransport('error', 'error'),
          createDailyRotateTransport('info', 'app'),
        ];

        return {
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('Yio-App', {
                  colors: true,
                  prettyPrint: true,
                }),
              ),
            }),
            ...transportList,
          ],
        };
      },
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, new HeaderResolver(['x-lang'])],
      typesOutputPath: join(__dirname, '../src/common/i18n.generated.ts'),
    }),

    // 队列
    QueueModule,

    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpExceptionInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class CoreModule {}
