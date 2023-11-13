import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MurLockModule } from 'murlock';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { MurLockModuleOptions } from 'murlock/dist/interfaces/murlock-options.interface';
import { ThrottlerModule } from '@nestjs/throttler';

/**
 * 创建一个每日轮转的传输对象。
 *
 * @param {string} level - 日志级别。
 * @param {string} filename - 日志文件的基本文件名。
 * @return {DailyRotateFile} - DailyRotateFile 对象。
 */
function createDailyRotateTransport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MurLockModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const murLockModuleOptions = {
          redisOptions: {
            host: configService.get('REDIS_HOST') as number,
            port: configService.get('REDIS_PORT'),
          },
          wait: configService.get('REDIS_WAIT'),
          maxAttempts: configService.get('REDIS_MAX_ATTEMPTS'),
          logLevel: configService.get('REDIS_LOG_LEVEL'),
        } as MurLockModuleOptions;

        return murLockModuleOptions;
      },
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProEnv = configService.get('ENVIRONMENT') === 'production';
        const transportList = isProEnv
          ? [
              createDailyRotateTransport('error', 'error'),
              createDailyRotateTransport('info', 'app'),
            ]
          : [];
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
})
export class CoreModule {}
