import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import compression from 'compression';

import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log'],
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const globalPrefix = 'api';

  // 使用 winston 日志库替代默认日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.setGlobalPrefix(globalPrefix);

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
    }),
  );

  // 启用 gzip 压缩
  app.use(compression());

  // 允许跨域
  app.enableCors();

  // 通过适当设置 HTTP 标头，Helmet 可以帮助保护您的应用程序免受一些众所周知的 Web 漏洞的影响。 一般来说，Helmet 只是一些较小的中间件功能的集合，用于设置与安全相关的 HTTP 标头
  app.use(helmet());

  // 如果在服务器和以太网之间存在负载均衡或者反向代理，Express 可能需要配置为信任 proxy 设置的头文件，从而保证最终用户得到正确的 IP 地址
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // see https://expressjs.com/en/guide/behind-proxies.html
  // app.set('trust proxy', 1);

  await app.listen(port);

  Logger.log(`🚀 应用程序正在运行: http://localhost:${port}/${globalPrefix}/v1`);
}
bootstrap();
