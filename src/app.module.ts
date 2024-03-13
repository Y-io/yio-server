import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '@/env.validation';
import { CacheService } from '@/core/cache';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { DatabaseModule } from '@/core/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidation,
    }),
    // 速率限制
    ThrottlerModule.forRootAsync({
      inject: [CacheService],
      useFactory: (cacheService: CacheService) => ({
        storage: new ThrottlerStorageRedisService(cacheService.client),
        throttlers: [
          {
            ttl: 60000,
            limit: 10,
          },
        ],
      }),
    }),
    DatabaseModule.forRoot({
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
