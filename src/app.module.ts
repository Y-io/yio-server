import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  MetadataScanner,
  ModulesContainer,
} from '@nestjs/core';

import { hash } from '@node-rs/argon2';
import { PERMISSION_DEF, RESOURCE_DEF } from '@/common/decorators';
import { Permission, Resource } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { SUPER_ADMIN } from '@/common/constants';
import { EventsModule } from './events/events.module';
import { AuthModule } from '@/domain/auth/auth.module';
import { UserModule } from '@/domain/user/user.module';
import { SystemModuleModule } from '@/domain/system-module/system-module.module';
import { OrganizationModule } from '@/domain/organization/organization.module';
import { RoleModule } from '@/domain/role/role.module';
import { MenuModule } from '@/domain/menu/menu.module';
import { NotificationModule } from '@/domain/notification/notification.module';
import { MessageModule } from '@/domain/message/message.module';
import { HttpExceptionFilter } from '@/common/filters';
import { HttpExceptionInterceptor } from '@/common/interceptors/http-exception.interceptor';
import { JwtGuard } from '@/common/guards';

type ResourceMap = { name: string; identify: string; moduleName: string };
type PermissionMap = {
  name: string;
  identify: string;
  action: string;
  resourceIdentify: string;
};

@Module({
  imports: [
    CoreModule,
    SystemModuleModule,
    UserModule,
    AuthModule,
    OrganizationModule,
    RoleModule,
    MenuModule,
    NotificationModule,
    MessageModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpExceptionInterceptor,
    },
    AppService,
  ],
  exports: [],
})
export class AppModule implements OnModuleInit {
  private readonly metadataScanner: MetadataScanner;

  private systemModuleSet: Set<string> = new Set([]);
  private resourceMap: Map<string, ResourceMap> = new Map();
  private permissionMap: Map<string, PermissionMap> = new Map();

  constructor(
    private modulesContainer: ModulesContainer,
    private prisma: PrismaService,
  ) {
    this.metadataScanner = new MetadataScanner();
  }
  async onModuleInit() {
    await this.loadResourcesAndPermissions();
    await this.createDefaultRole();

    const user = await this.prisma.user.findUnique({
      where: {
        username: 'admin1',
      },
    });
    const role = await this.prisma.role.findUnique({
      where: {
        name: 'ordinary',
      },
    });

    if (!user && role) {
      await this.prisma.user.create({
        data: {
          username: 'admin1',
          password: await hash('admin1'),
          roles: {
            create: {
              roleId: role.id,
            },
          },
        },
      });
    }

    await this.createSuperAdmin();
  }

  private async loadResourcesAndPermissions() {
    this.modulesContainer.forEach((moduleValue) => {
      for (const [, controller] of moduleValue.controllers) {
        // 是否为 Controller
        const isController =
          Reflect.getMetadataKeys(controller.instance.constructor).filter((v) =>
            ['path'].includes(v),
          ).length > 0;

        if (isController) {
          // 资源
          const resource: Resource = Reflect.getMetadata(
            RESOURCE_DEF,
            controller.instance.constructor,
          );

          const prototype = Object.getPrototypeOf(controller.instance);

          if (resource && !!prototype) {
            const names = this.metadataScanner.getAllMethodNames(prototype);
            const moduleName = moduleValue.metatype.name;

            this.resourceMap.set(resource.name, { ...resource, moduleName });

            const permissions = names
              .map((name) => Reflect.getMetadata(PERMISSION_DEF, controller.instance, name))
              .filter(Boolean) as Permission[];

            permissions.forEach((permission) => {
              this.permissionMap.set(permission.name, {
                ...permission,
                resourceIdentify: resource.identify,
              });
            });

            this.systemModuleSet.add(moduleValue.metatype.name);
          }
        }
      }
    });

    await this.loadSystemModules();
    await this.loadResources();
    await this.loadPermissions();
  }

  /**
   * 加载系统模块
   * @private
   */
  private async loadSystemModules() {
    // 所有系统模块
    const allModules = [...this.systemModuleSet.values()];

    // 删除已不在的系统模块
    await this.prisma.systemModule.deleteMany({
      where: {
        name: {
          notIn: allModules,
        },
      },
    });

    // 当前已存在的系统模块
    const existSystemModules = await this.prisma.systemModule.findMany();

    // 新的系统模块
    const newSystemModules = allModules.filter(
      (v) => !existSystemModules.map((v) => v.name).includes(v),
    );
    if (newSystemModules.length > 0) {
      await this.prisma.systemModule.createMany({
        data: newSystemModules.map((v) => ({
          name: v,
        })),
      });
    }
  }

  /**
   * 加载资源
   * @private
   */
  private async loadResources() {
    // 所有资源
    const allResources = <ResourceMap[]>[].concat(...[...this.resourceMap.values()]);

    // 已移除的资源
    await this.prisma.resource.deleteMany({
      where: {
        identify: {
          notIn: allResources.map((v) => v.identify),
        },
      },
    });

    // 当前已有的资源
    const existResources = await this.prisma.resource.findMany();

    // 新的资源
    const newResources = allResources.filter(
      (s) =>
        // 从所有资源列表中过滤掉当前已有的资源，获得新的资源
        !existResources.map((e) => e.identify).includes(s.identify),
    );

    // 创建新的资源
    if (newResources.length > 0) {
      const modules = await this.prisma.systemModule.findMany();

      await this.prisma.resource.createMany({
        data: newResources.map((resource) => {
          return {
            identify: resource.identify,
            name: resource.name,
            systemModuleId: modules.find((module) => module.name === resource.moduleName).id,
          };
        }),
      });
    }

    // 更新资源
    if (existResources.length > 0) {
      existResources.forEach((v) => {
        v.name = allResources.find((s) => s.identify === v.identify).name;
      });
      await this.prisma.$transaction(
        existResources.map((resource) =>
          this.prisma.resource.update({
            where: {
              identify: resource.identify,
            },
            data: {
              name: resource.name,
            },
          }),
        ),
      );
    }
  }

  /**
   * 加载权限
   * @private
   */
  private async loadPermissions() {
    // 所有权限
    const allPermissions = <PermissionMap[]>[].concat(...[...this.permissionMap.values()]);

    await this.prisma.permission.deleteMany({
      where: { identify: { notIn: allPermissions.map((v) => v.identify) } },
    });

    // 当前所有权限
    const existPermissions = await this.prisma.permission.findMany();
    const resources = await this.prisma.resource.findMany();
    // 新的权限
    const newPermissions = allPermissions.filter(
      (sp) => !existPermissions.map((v) => v.identify).includes(sp.identify),
    );
    // 创建新的权限
    if (newPermissions.length > 0) {
      await this.prisma.permission.createMany({
        data: newPermissions.map((permission) => {
          return {
            identify: permission.identify,
            name: permission.name,
            resourceId: resources.find(
              (resource) => resource.identify === permission.resourceIdentify,
            ).id,
            action: permission.action,
          };
        }),
      });
    }

    // 更新权限
    if (existPermissions.length > 0) {
      existPermissions.forEach((ep) => {
        ep.name = allPermissions.find((sp) => sp.identify === ep.identify).name;
        ep.action = allPermissions.find((sp) => sp.identify === ep.identify).action;
      });
      await this.prisma.$transaction(
        existPermissions.map((permission) =>
          this.prisma.permission.update({
            where: {
              identify: permission.identify,
            },
            data: {
              name: permission.name,
            },
          }),
        ),
      );
    }
  }

  private async createDefaultRole() {
    const ordinaryRole = await this.prisma.role.findUnique({
      where: {
        name: 'ordinary',
      },
    });

    if (ordinaryRole) return;

    await this.prisma.role.create({
      data: {
        name: 'ordinary',
      },
    });
  }

  private async createSuperAdmin() {
    const superAdmin = await this.prisma.user.findUnique({
      where: {
        username: SUPER_ADMIN,
      },
    });

    if (!superAdmin) {
      await this.prisma.user.create({
        data: {
          username: SUPER_ADMIN,
          password: await hash(SUPER_ADMIN),
        },
      });
    }
  }
}
