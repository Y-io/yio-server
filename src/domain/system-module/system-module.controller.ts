import { Controller, Get } from '@nestjs/common';
import { SystemModuleService } from './system-module.service';
import { Permission, Resource, SkipAuth } from '../../common/decorators';

@SkipAuth()
@Resource({
  name: 'system_modules_manage',
  identify: 'system_modules:manage',
})
@Controller({
  path: 'system-modules',
  version: '1',
})
export class SystemModuleController {
  constructor(private systemModuleService: SystemModuleService) {}

  @Permission({
    name: 'find_system_modules',
    identify: 'system_modules:find_system_modules',
    action: 'find',
  })
  @Get()
  async findMany() {
    return this.systemModuleService.findMany();
  }
}
