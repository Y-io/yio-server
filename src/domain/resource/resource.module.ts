import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from '@/domain/resource/entities/resource.entity';
import { PermissionEntity } from '@/domain/resource/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity, PermissionEntity])],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [TypeOrmModule],
})
export class ResourceModule {}
