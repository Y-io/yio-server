import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { RoleModule } from './role/role.module';

import { SystemModuleModule } from './system-module/system-module.module';
import { MenuModule } from './menu/menu.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    AccountModule,
    AuthModule,
    SystemModuleModule,
    OrganizationModule,
    MenuModule,
  ],
  providers: [],
  exports: [
    UserModule,
    RoleModule,
    AccountModule,
    AuthModule,
    SystemModuleModule,
    OrganizationModule,
  ],
})
export class DomainModule {}
