import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PermissionEntity } from '@/domain/system-module/entities/permission.entity';
import { YioBaseEntity } from '@/shared/yio-base.entity';
import { SystemModuleEntity } from '@/domain/system-module/entities/system-module.entity';

@Entity('resource')
export class ResourceEntity extends YioBaseEntity {
  @Column()
  name: string;

  @Column({
    unique: true,
  })
  identify: string;

  @OneToMany(() => PermissionEntity, (permission) => permission.resource)
  permissions: PermissionEntity[];

  @ManyToOne(() => SystemModuleEntity, (systemModule) => systemModule.resources, {
    onDelete: 'CASCADE',
  })
  systemModule: SystemModuleEntity;
}
