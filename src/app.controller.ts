import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Resource } from '@/shared/decorators/resource.decorator';
import { Permission } from '@/shared/decorators/permission.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
