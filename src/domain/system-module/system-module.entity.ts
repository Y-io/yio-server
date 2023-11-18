import { Column, Entity, OneToMany } from 'typeorm';
import { YioBaseEntity } from '@/shared/yio-base.entity';
import { ResourceEntity } from '@/domain/resource/entities/resource.entity';

@Entity('system-module')
export class SystemModuleEntity extends YioBaseEntity {
  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(() => ResourceEntity, (resource) => resource.systemModule)
  resources: ResourceEntity[];
}
