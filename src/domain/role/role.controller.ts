import { Controller, Get } from '@nestjs/common';
import { RoleService } from '@/domain/role/role.service';
import { SkipAuth } from '@/shared/decorators/skip-auth.decorator';
import { Resource } from '@/shared/decorators/resource.decorator';
import { Permission } from '@/shared/decorators/permission.decorator';

@SkipAuth()
@Resource({
  name: 'roles_manage',
  identify: 'roles:manage',
})
@Controller({
  path: 'roles',
  version: '1',
})
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Permission({
    name: 'find_roles',
    identify: 'roles:find_roles',
    action: 'find',
  })
  @Get()
  async findMany() {
    return this.roleService.findMany();
  }
}
