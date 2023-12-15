import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { Permission, Resource, SkipAuth } from '../../common/decorators';
import { CreateRoleDto } from './dto/create-role.dto';
import { SetPermissionsDto } from './dto/set-permissions.dto';

@SkipAuth()
@Resource({ name: 'roles_manage', identify: 'roles:manage' })
@Controller({ path: 'roles', version: '1' })
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Permission({ name: 'find_roles', identify: 'roles:find_roles', action: 'find' })
  @Get()
  async findMany() {
    return this.roleService.findMany();
  }
  @Permission({
    name: 'find_role',
    identify: 'roles:find_role',
    action: 'find',
  })
  @Put(':id')
  async findRoleById(@Param('id') id: string) {
    return this.roleService.findRoleById(id);
  }
  @Permission({
    name: 'create_role',
    identify: 'roles:create_role',
    action: 'create',
  })
  @Post()
  async createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Permission({
    name: 'delete_role',
    identify: 'roles:delete_role',
    action: 'delete',
  })
  @Delete(':id')
  async deleteRoleById(@Param('id') id: string) {
    return this.roleService.deleteRoleById(id);
  }

  @Permission({
    name: 'set_permissions',
    identify: 'roles:set_permissions',
    action: 'update',
  })
  @Post()
  async setPermissions(@Body() dto: SetPermissionsDto) {
    return this.roleService.setPermissions(dto.id, dto.permissionIds);
  }
}
