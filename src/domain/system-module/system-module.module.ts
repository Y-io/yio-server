import { Module } from '@nestjs/common';
import { SystemModuleController } from './system-module.controller';
import { SystemModuleService } from './system-module.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModuleEntity } from '@/domain/system-module/system-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemModuleEntity])],
  controllers: [SystemModuleController],
  providers: [SystemModuleService],
  exports: [TypeOrmModule],
})
export class SystemModuleModule {}
