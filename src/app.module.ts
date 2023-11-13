import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { DomainModule } from './domain/domain.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CoreModule, PrismaModule, DomainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
