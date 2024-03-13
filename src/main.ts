import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import fastifyCsrf from '@fastify/csrf-protection';
import { ConfigService } from '@nestjs/config';
import cors from '@fastify/cors';
import compression from '@fastify/compress';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  app.setGlobalPrefix('api');

  // 版本号
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // 全局参数过滤
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  await app.register(cors);
  await app.register(fastifyCsrf);

  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 应用程序正在运行: ${await app.getUrl()}`);
}

bootstrap();
