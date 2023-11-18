import { Module } from '@nestjs/common';
import { SystemModuleController } from './system-module.controller';
import { SystemModuleService } from './system-module.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModuleEntity } from '@/domain/system-module/entities/system-module.entity';
import { ResourceEntity } from '@/domain/system-module/entities/resource.entity';
import { PermissionEntity } from '@/domain/system-module/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemModuleEntity, ResourceEntity, PermissionEntity])],
  controllers: [SystemModuleController],
  providers: [SystemModuleService],
  exports: [TypeOrmModule],
})
export class SystemModuleModule {}
