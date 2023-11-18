import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { RoleEntity } from '@/domain/role/role.entity';
import { YioBaseEntity } from '@/shared/yio-base.entity';
import { OrganizationEntity } from '@/domain/organization/organization.entity';

@Entity('user')
export class UserEntity extends YioBaseEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];

  @ManyToMany(() => OrganizationEntity, (organization) => organization.users)
  @JoinTable()
  organizations: OrganizationEntity[];
}
