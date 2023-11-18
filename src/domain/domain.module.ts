import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AccountService } from './account/account.service';
import { AccountModule } from './account/account.module';
import { RoleModule } from './role/role.module';
import { ResourceModule } from './resource/resource.module';

import { SystemModuleModule } from './system-module/system-module.module';
import { MenuModule } from './menu/menu.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    AccountModule,
    AuthModule,
    ResourceModule,
    SystemModuleModule,
    OrganizationModule,
    //  RoleModule, ResourceModule, PermissionModule, SystemModuleModule, MenuModule, OrganizationModule
  ],
  providers: [],
  exports: [
    UserModule,
    RoleModule,
    AccountModule,
    AuthModule,
    ResourceModule,
    SystemModuleModule,
    OrganizationModule,
  ],
})
export class DomainModule {}
