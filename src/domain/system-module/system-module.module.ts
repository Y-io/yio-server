import { Module } from '@nestjs/common';
import { SystemModuleController } from './system-module.controller';
import { SystemModuleService } from './system-module.service';

@Module({
  imports: [],
  controllers: [SystemModuleController],
  providers: [SystemModuleService],
  exports: [],
})
export class SystemModuleModule {}
