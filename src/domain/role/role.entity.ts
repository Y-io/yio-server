import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { UserEntity } from '@/domain/user/user.entity';
import { YioBaseEntity } from '@/shared/yio-base.entity';
import { PermissionEntity } from '@/domain/system-module/entities/permission.entity';

@Entity('role')
export class RoleEntity extends YioBaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable()
  permissions: PermissionEntity[];
}
