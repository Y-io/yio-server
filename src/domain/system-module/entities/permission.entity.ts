import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { YioBaseEntity } from '@/shared/yio-base.entity';
import { ResourceEntity } from '@/domain/system-module/entities/resource.entity';
import { RoleEntity } from '@/domain/role/role.entity';
import { PermissionAction } from '@/shared/decorators/permission.decorator';

@Entity('permission')
export class PermissionEntity extends YioBaseEntity {
  @Column()
  name: string;

  @Column()
  identify: string;

  @Column()
  action: PermissionAction;

  @ManyToOne(() => ResourceEntity, (resource) => resource.permissions, {
    onDelete: 'CASCADE',
  })
  resource: ResourceEntity;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
