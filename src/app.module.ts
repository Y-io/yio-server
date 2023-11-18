import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { DomainModule } from './domain/domain.module';
import { APP_GUARD, MetadataScanner, ModulesContainer } from '@nestjs/core';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { RESOURCE_DEF } from '@/shared/decorators/resource.decorator';
import { PERMISSION_DEF } from '@/shared/decorators/permission.decorator';

import { hash } from '@node-rs/argon2';
import { UserService } from '@/domain/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/domain/user/user.entity';
import { In, Not, Repository } from 'typeorm';
import { SystemModuleEntity } from '@/domain/system-module/entities/system-module.entity';
import { RoleEntity } from '@/domain/role/role.entity';
import { ResourceEntity } from '@/domain/system-module/entities/resource.entity';
import { PermissionEntity } from '@/domain/system-module/entities/permission.entity';
import { SUPER_ADMIN } from '@/shared/constants';
import { PermissionGuard } from '@/shared/guards/permission.guard';

@Module({
  imports: [CoreModule, DomainModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      // 必须在 JwtAuthGuard 后面，需要用户信息
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    AppService,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly metadataScanner: MetadataScanner;

  private systemModuleMap: Map<string, { name: string; resources: ResourceEntity[] }> = new Map();

  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(SystemModuleEntity)
    private systemModuleRepository: Repository<SystemModuleEntity>,
    @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
    @InjectRepository(ResourceEntity) private resourceRepository: Repository<ResourceEntity>,
    @InjectRepository(PermissionEntity) private permissionRepository: Repository<PermissionEntity>,
    private modulesContainer: ModulesContainer,
    private userService: UserService,
  ) {
    this.metadataScanner = new MetadataScanner();
  }
  async onModuleInit() {
    await this.loadResourcesAndPermissions();
    await this.createDefaultRole();
    await this.createSuperAdmin();
  }

  /**
   * 加载系统模块
   * @private
   */
  private async loadSystemModules() {
    // 所有系统模块
    const allModules = [...this.systemModuleMap.values()];

    // 已移除的系统模块
    const notExistSystemModules = await this.systemModuleRepository.findBy({
      name: Not(In(allModules.map((v) => v.name))),
    });

    if (notExistSystemModules.length > 0) {
      await this.systemModuleRepository.delete(notExistSystemModules.map((v) => v.id));
    }

    const existSystemModules = await this.systemModuleRepository.find();

    // 新的系统模块
    const newSystemModules = allModules.filter(
      (v) => !existSystemModules.map((v) => v.name).includes(v.name),
    );
    if (newSystemModules.length > 0) {
      await this.systemModuleRepository.save(
        this.systemModuleRepository.create(
          newSystemModules.map((v) => ({
            name: v.name,
          })),
        ),
      );
    }

    // 更新资源
    if (existSystemModules.length > 0) {
      existSystemModules.forEach((v) => {
        v.name = allModules.find((s) => s.name === v.name).name;
      });
      await this.systemModuleRepository.save(existSystemModules);
    }
  }

  /**
   * 加载资源
   * @private
   */
  private async loadResources() {
    for (const [, value] of this.systemModuleMap) {
      const systemModule = await this.systemModuleRepository.findOne({
        where: { name: value.name },
      });
      value.resources.forEach((resource) => {
        resource.systemModule = systemModule;
      });
    }

    // 所有资源
    const allResources: ResourceEntity[] = <ResourceEntity[]>(
      [].concat(...[...this.systemModuleMap.values()].map((s) => s.resources))
    );

    // 已移除的资源列表
    const notExistResources = await this.resourceRepository.findBy({
      identify: Not(In(allResources.map((v) => v.identify))),
    });
    // 如果有已移除的资源，则需要进行删除
    if (notExistResources.length > 0) {
      await this.resourceRepository.delete(notExistResources.map((v) => v.id));
    }

    // 当前已有的资源
    const existResources = await this.resourceRepository.find();

    // 新的资源
    const newResources = !existResources.length
      ? allResources
      : allResources.filter(
          (s) =>
            // 从所有资源列表中过滤掉当前已有的资源，获得新的资源
            !existResources.map((e) => e.identify).includes(s.identify),
        );

    // 创建新的资源
    if (newResources.length > 0) {
      await this.resourceRepository.save(this.resourceRepository.create(newResources));
    }

    // 更新资源
    if (existResources.length > 0) {
      existResources.forEach((v) => {
        v.name = allResources.find((s) => s.identify === v.identify).name;
      });
      await this.resourceRepository.save(existResources);
    }
  }

  /**
   * 加载权限
   * @private
   */
  private async loadPermissions() {
    const resources = <ResourceEntity[]>(
      [].concat(...[...this.systemModuleMap.values()].map((s) => s.resources))
    );

    // 所有权限
    const allPermissions = <PermissionEntity[]>[].concat(
      ...resources.map((metadataValue) => {
        metadataValue.permissions.forEach((v) => (v.resource = metadataValue));
        return metadataValue.permissions;
      }),
    );

    // 当前所有资源
    const resource = await this.resourceRepository.find({
      where: { identify: In(allPermissions.map((v) => v.resource.identify)) },
    });

    allPermissions.forEach((permission) => {
      permission.resource = resource.find((v) => v.identify === permission.resource.identify);
    });
    const notExistPermissions = await this.permissionRepository.find({
      where: { identify: Not(In(allPermissions.map((v) => v.identify))) },
    });
    if (notExistPermissions.length > 0)
      await this.permissionRepository.delete(notExistPermissions.map((v) => v.id));

    // 当前所有权限
    const existPermissions = await this.permissionRepository.find({ order: { id: 'ASC' } });
    // 新的权限
    const newPermissions = allPermissions.filter(
      (sp) => !existPermissions.map((v) => v.identify).includes(sp.identify),
    );
    // 创建新的权限
    if (newPermissions.length > 0)
      await this.permissionRepository.save(this.permissionRepository.create(newPermissions));

    // 更新权限
    if (existPermissions.length > 0) {
      existPermissions.forEach((ep) => {
        ep.name = allPermissions.find((sp) => sp.identify === ep.identify).name;
        ep.action = allPermissions.find((sp) => sp.identify === ep.identify).action;
      });
      await this.permissionRepository.save(existPermissions);
    }
  }

  private async loadResourcesAndPermissions() {
    this.modulesContainer.forEach((moduleValue, moduleKey) => {
      for (const [, controller] of moduleValue.controllers) {
        // 是否为 Controller
        const isController =
          Reflect.getMetadataKeys(controller.instance.constructor).filter((v) =>
            ['path'].includes(v),
          ).length > 0;

        if (isController) {
          // 资源
          const resource: ResourceEntity = Reflect.getMetadata(
            RESOURCE_DEF,
            controller.instance.constructor,
          );

          const prototype = Object.getPrototypeOf(controller.instance);

          if (resource && !!prototype) {
            const names = this.metadataScanner.getAllMethodNames(prototype);

            resource.permissions = names
              .map((name) => Reflect.getMetadata(PERMISSION_DEF, controller.instance, name))
              .filter(Boolean) as PermissionEntity[];

            const moduleName = moduleValue.metatype.name;

            if (this.systemModuleMap.has(moduleKey)) {
              this.systemModuleMap.get(moduleKey).name = moduleName;
              this.systemModuleMap.get(moduleKey).resources.push(resource);
            } else {
              this.systemModuleMap.set(moduleKey, { name: moduleName, resources: [resource] });
            }
          }
        }
      }
    });

    await this.loadSystemModules();
    await this.loadResources();
    await this.loadPermissions();
  }

  private async createDefaultRole() {
    await this.roleRepository.save(
      this.roleRepository.create({
        name: 'ordinary',
      }),
    );
  }

  private async createSuperAdmin() {
    const superAdmin = await this.userRepository.findOneBy({
      username: SUPER_ADMIN,
    });

    if (!superAdmin) {
      await this.userRepository.save(
        this.userRepository.create({
          username: SUPER_ADMIN,
          password: await hash(SUPER_ADMIN),
        }),
      );
    }
  }
}
