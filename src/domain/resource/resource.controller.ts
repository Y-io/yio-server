import { Controller, Get } from '@nestjs/common';
import { ResourceService } from '@/domain/resource/resource.service';
import { SkipAuth } from '@/domain/auth/guards/skip-auth';
import { Resource } from '@/shared/decorators/resource.decorator';
import { Permission } from '@/shared/decorators/permission.decorator';

@SkipAuth()
@Resource({
  name: 'resources_manage',
  identify: 'resources:manage',
})
@Controller({
  path: 'resources',
  version: '1',
})
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Permission({
    name: 'find_resources',
    identify: 'resources:find_resources',
    action: 'find',
  })
  @Get()
  async findMany() {}
  @Permission({
    name: 'delete_resource',
    identify: 'resources:delete_resource',
    action: 'delete',
  })
  @Get()
  async delete() {
    return '';
  }
}
