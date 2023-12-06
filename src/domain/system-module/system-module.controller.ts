import { Controller, Get } from '@nestjs/common';
import { Resource } from '@/common/decorators/resource.decorator';
import { SystemModuleService } from '@/domain/system-module/system-module.service';
import { SkipAuth } from '@/common/decorators/skip-auth.decorator';
import { Permission } from '@/common/decorators/permission.decorator';

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
